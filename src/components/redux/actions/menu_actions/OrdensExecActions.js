import {
  MUDAR_VARIAVEL_ORDENS_EXEC,
  ADICIONAR_ABA,
  MODIFICAR_VARIAVEL_MULTILEG
} from "constants/MenuActionTypes";
import {
  listarOrdensExecAPI,
  travarDestravarClique,
  cancelarOrdemExecAPI,
  finalizarAMercadoAPI,
  incrementarQtdeOrdemExecAPI,
  incrementarPrecoOrdemExecAPI,
  pesquisarAtivoAPI,
  atualizarOrdensExecAPI
} from "components/api/API";
import { LISTAR_ORDENS_EXECUCAO } from "constants/ApiActionTypes";
import {
  atualizarCotacaoAction,
  adicionarOferta
  // atualizarBookAction
} from "components/redux/actions/menu_actions/MultilegActions";
import {
  adicionarAba,
  modificarAba
} from "components/redux/actions/menu_actions/MultilegActions";
import { pesquisaAtivo } from "components/redux/actions/api_actions/MenuAPIAction";
import { erro_exportar_ordens_multileg } from "constants/AlertaErros";
import {
  calculoPreco,
  calculoMDC
} from "components/forms/multileg_/CalculoPreco";
import { formatarNumero } from "components/redux/reducers/formInputReducer";

export const mudarVariavelOrdensExecAction = (nome, valor) => {
  return dispatch => {
    dispatch({
      type: MUDAR_VARIAVEL_ORDENS_EXEC,
      payload: { nome, valor }
    });
  };
};

export const filtrarHistoricoOpAction = () => {
  return dispatch => {};
};

export const listarOrdensExecAction = props => {
  return async dispatch => {
    const ordensExec = await listarOrdensExecAPI();

    dispatch({ type: LISTAR_ORDENS_EXECUCAO, payload: ordensExec });
    atualizarOrdensExec(dispatch, props, 1, ordensExec);
  };
};

export const abrirOrdemNoMultilegAction = (props, acao = "") => {
  return async dispatch => {
    travarDestravarClique("travar", "menusTelaPrincipal");
    const item = props.ordemAtual;

    let multilegAberto = props.multilegAberto;

    //Abrir Multileg
    props.atualizarDivKeyAction("multileg");

    //Se o multileg não estiver aberto, remove a primeira aba e abre o mesmo
    if (!multilegAberto) {
      props.multileg.pop();
      props.abrirItemBarraLateralAction(props, "multilegAberto");
    } else {
      //Traz para primeiro plano se já estiver aberto
      document.getElementById("multileg").style.zIndex = props.zIndex + 1;
      props.aumentarZindexAction("multileg", props.zIndex, true);
    }

    //Adicionar aba
    let objMultileg = adicionarAba(props);

    let multileg = objMultileg.abasMultileg;
    let cotacoesMultileg = props.cotacoesMultileg;
    const indiceAba = multileg.length - 1;
    //const arrayCodigos = [...new Set(item.offers.map(oferta => oferta.ativo))];

    try {
      for (const [indiceOferta, oferta] of item.offers.entries()) {
        //Alterar ativo
        const dadosModificados = await modificarAba(
          multileg,
          indiceAba,
          "ativo",
          oferta.ativo
        );
        multileg = dadosModificados.abasMultileg;

        //Pesquisar ativo
        const retornoPesquisa = await pesquisaAtivo(
          multileg,
          indiceAba,
          cotacoesMultileg
        );
        multileg = retornoPesquisa.multileg;
        cotacoesMultileg = retornoPesquisa.cotacoesMultileg;

        const opcao = multileg[indiceAba].opcoes.filter(
          opcao => opcao.symbol === oferta.ativo
        );
        let tipo = "";
        if (opcao.length > 0) tipo = opcao[0].type.toLowerCase();
        else tipo = "acao";
        //Adicionar oferta
        const dadosMultileg = await adicionarOferta(
          multileg,
          tipo,
          indiceAba,
          cotacoesMultileg
        );
        multileg = dadosMultileg.abasMultileg;
        cotacoesMultileg = dadosMultileg.cotacoesMultileg;

        const ofertaNova = multileg[indiceAba].tabelaMultileg[indiceOferta];

        //Ações possíveis do menu de ordens em execução
        if (acao === "reabrir") {
          const qtdeCancelada = oferta.qtdeOferta - oferta.qtdeExecutada;

          ofertaNova.qtde = qtdeCancelada;
        } else ofertaNova.qtde = oferta.qtdeOferta;
        if (acao === "oposta")
          ofertaNova.cv = oferta.oferta === "C" ? "venda" : "compra";
        else ofertaNova.cv = oferta.oferta === "C" ? "compra" : "venda";
      }

      let calculo = calculoPreco(
        multileg[indiceAba],
        "ultimo",
        [],
        cotacoesMultileg
      ).toFixed(2);
      calculo = formatarNumero(calculo, 2, ".", ",");
      multileg[indiceAba].preco = calculo;
    } catch (erro) {
      console.log(erro);
      alert(erro_exportar_ordens_multileg);
    }

    //Disparar atualizações feitas com objeto multileg
    objMultileg.abasMultileg = multileg;

    dispatch({
      type: ADICIONAR_ABA,
      payload: {
        multileg: objMultileg.abasMultileg,
        abaSelecionada: objMultileg.abaAtual
      }
    });

    dispatch({
      type: MODIFICAR_VARIAVEL_MULTILEG,
      payload: { nome: "cotacoesMultileg", valor: cotacoesMultileg }
    });
    atualizarCotacaoAction(dispatch, props, cotacoesMultileg);
    travarDestravarClique("destravar", "menusTelaPrincipal");
  };
};

export const abrirOrdensBoletaAction = (props, event, acao) => {
  return async dispatch => {
    const { ordemAtual } = props;
    let nome = mapearOperacaoParaBoleta(ordemAtual.operacao);

    const oferta = ordemAtual.offers[0];
    const dadosPesquisa = await pesquisarAtivoAPI(ordemAtual.offers[0].ativo);

    let qtde = oferta.qtdeOferta;
    if (acao === "reabrir") {
      qtde = oferta.qtdeOferta - oferta.qtdeExecutada;
    }
    if (acao === "oposta") {
      let nomeSplit = nome.split("_");
      if (nomeSplit[0] === "compra") nomeSplit[0] = "venda";
      else if (nomeSplit[0] === "venda") nomeSplit[0] = "compra";
      if (nome === "compra_startmovel") nomeSplit[1] = "stopmovel";

      nome = nomeSplit.join("_");
    }

    const dados = {
      dadosOrdemExec: {
        dadosPesquisa: dadosPesquisa,
        ativo: oferta.ativo,
        qtde: qtde,
        entradaDisparo: oferta.precoDisparo,
        entradaExec: oferta.precoEnvio,
        preco: oferta.precoEnvio ? oferta.precoEnvio.toString() : "",
        ...retornaDadosOferta(ordemAtual, nome)
      },
      ultimaBoletaAbertaOrdemExec: nome
    };

    if (nome) {
      props.receberDadosOrdemExecMainReducerAction(dados);
      props.abrirFormAction(event, props, "", nome);
    }
  };
};

export const cancelarOrdemExecAction = id => {
  return dispatch => {
    cancelarOrdemExecAPI(id);
  };
};

export const finalizarAMercadoAction = id => {
  return dispatch => {
    finalizarAMercadoAPI(id);
  };
};

export const aumentarQtdePrecoAction = (ordemAtual, valorSomar, modo) => {
  return dispatch => {
    const { id } = ordemAtual;
    const ofertas = [...ordemAtual.offers];
    const arrayQtde = ofertas.map(oferta => oferta.qtdeOferta);
    const mdc = calculoMDC(arrayQtde);

    if (modo === "qtde") {
      let acrescimo = 0;
      ofertas.forEach(oferta => {
        const unidade = oferta.qtdeOferta / mdc;
        acrescimo += valorSomar * unidade;
      });
      incrementarQtdeOrdemExecAPI(id, acrescimo);
    } //
    else if (modo === "preco") {
      let precoTotal = 0;
      ofertas.forEach(oferta => {
        const unidade = oferta.qtdeOferta / mdc;
        precoTotal += oferta.precoEnvio * unidade;
      });
      precoTotal += valorSomar;
      incrementarPrecoOrdemExecAPI(id, precoTotal);
    }
  };
};

const mapearOperacaoParaBoleta = operacao => {
  switch (operacao) {
    case "Compra a Mercado":
      return "compra_mercado";
    case "Compra Limitada":
      return "compra_limitada";
    case "Compra Agendada":
      return "compra_agendada";
    case "Compra Start Stop":
      return "compra_startstop";
    case "Compra Stop Móvel":
      return "compra_startmovel";
    case "Venda a Mercado":
      return "venda_mercado";
    case "Venda Limitada":
      return "venda_limitada";
    case "Venda Agendada":
      return "venda_agendada";
    case "Venda Start Stop":
      return "venda_startstop";
    case "Venda Stop Móvel":
      return "venda_stopmovel";
    default:
      return "";
  }
};

const retornaDadosOferta = (ordemAtual, tipo) => {
  const dadosOferta = {
    inicioDisparo: "",
    gainDisparo: "",
    gainExec: "",
    stopDisparo: "",
    stopExec: "",
    ajustePadrao: "",
    tabelaOrdens: []
  };

  if (["compra_startstop", "venda_startstop"].includes(tipo)) {
    let oferta1, oferta2;

    if (ordemAtual.offers[0]) {
      oferta1 = ordemAtual.offers[0];
      dadosOferta.gainDisparo = oferta1.precoDisparo;
      dadosOferta.gainExec = oferta1.precoEnvio;
    }

    if (ordemAtual.offers[1]) {
      oferta2 = ordemAtual.offers[1];
      dadosOferta.stopDisparo = oferta2.precoDisparo;
      dadosOferta.stopExec = oferta2.precoEnvio;
    }
  } //
  else if (["compra_startmovel", "venda_stopmovel"].includes(tipo)) {
    const ofertaPrincipal = ordemAtual.offers[0];

    const arrayAjustes = ordemAtual.offers.filter(
      (oferta, index) => index !== 0
    );
    const segundaOrdem = arrayAjustes[arrayAjustes.length - 1];

    if (segundaOrdem) {
      dadosOferta.inicioDisparo = segundaOrdem.precoDisparo;
      dadosOferta.ajustePadrao = segundaOrdem.precoEnvio;
    }
    dadosOferta.stopDisparo = ofertaPrincipal.precoDisparo;
    dadosOferta.stopExec = ofertaPrincipal.precoEnvio;

    arrayAjustes.pop();
    arrayAjustes.forEach((ofertaAjuste, indice) => {
      let novoStop, disparo, stopAtual;
      const ajuste = ofertaAjuste.precoEnvio;

      if (indice === 0) {
        stopAtual = dadosOferta.stopDisparo;
        disparo = ofertaAjuste.precoDisparo;
      } else {
        const linhaAnterior = dadosOferta.tabelaOrdens[indice - 1];
        disparo =
          tipo === "compra_startmovel"
            ? linhaAnterior.disparo - linhaAnterior.ajuste
            : linhaAnterior.disparo + linhaAnterior.ajuste;
        stopAtual = linhaAnterior.novoStop;
      }

      novoStop =
        tipo === "compra_startmovel" ? stopAtual - ajuste : stopAtual + ajuste;

      dadosOferta.tabelaOrdens.push({
        disparo: disparo,
        stopAtual: stopAtual,
        ajuste: ofertaAjuste.precoEnvio,
        novoStop: novoStop,
        tipo: "real"
      });
    });
  } //
  else {
    let next1, next2;
    if (ordemAtual.nextOrders[0]) {
      next1 = ordemAtual.nextOrders[0].offers[0];
      dadosOferta.gainDisparo = next1.precoDisparo;
      dadosOferta.gainExec = next1.precoEnvio;
    }
    if (ordemAtual.nextOrders[1]) {
      next2 = ordemAtual.nextOrders[1].offers[0];
      dadosOferta.stopDisparo = next2.precoDisparo;
      dadosOferta.stopExec = next2.precoEnvio;
    }
  }
  return dadosOferta;
};

export const atualizarOrdensExecAction = (props, idUsuario) => {
  return dispatch => {
    atualizarOrdensExec(dispatch, props, idUsuario, props.tabelaOrdensExecucao);
  };
};

const atualizarOrdensExec = (dispatch, props, idUsuario, listaOrdensExec) => {
  if (props.eventSourceOrdensExec) {
    props.eventSourceOrdensExec.close();
  }
  const eventSource = atualizarOrdensExecAPI(
    dispatch,
    idUsuario,
    listaOrdensExec,
    props
  );

  dispatch({
    type: MUDAR_VARIAVEL_ORDENS_EXEC,
    payload: { nome: "eventSourceOrdensExec", valor: eventSource }
  });
};
