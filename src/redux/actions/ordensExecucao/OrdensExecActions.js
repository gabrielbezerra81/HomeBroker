import { MUDAR_VARIAVEL_ORDENS_EXEC } from "constants/MenuActionTypes";
import {
  listarOrdensExecAPI,
  travarDestravarClique,
  cancelarOrdemExecAPI,
  finalizarAMercadoAPI,
  incrementarQtdeOrdemExecAPI,
  incrementarPrecoOrdemExecAPI,
  pesquisarAtivoAPI,
} from "api/API";
import { atualizarOrdensExecAPI } from "api/ReativosAPI";
import { LISTAR_ORDENS_EXECUCAO } from "constants/ApiActionTypes";
import {
  addMultilegTab,
  updateMultilegTab,
  updateMultilegQuotesAction,
  addMultilegOffer,
  updateMultilegStateAction,
  cloneMultilegTabs,
  cloneMultilegQuotes,
} from "redux/actions/multileg/MultilegActions";
import { searchMultilegSymbolData } from "redux/actions/multileg/MultilegAPIAction";
import { erro_exportar_ordens_multileg } from "constants/AlertaErros";
import { calculoPreco, calculoMDC } from "telas/popups/multileg_/CalculoPreco";
import { formatarNumero } from "redux/reducers/boletas/formInputReducer";
import { getReducerStateStorePrincipal } from "hooks/utils";
import { abrirItemBarraLateralAction } from "../system/SystemActions";

export const mudarVariavelOrdensExecAction = (nome, valor) => {
  return (dispatch) => {
    dispatch({
      type: MUDAR_VARIAVEL_ORDENS_EXEC,
      payload: { nome, valor },
    });
  };
};

export const filtrarHistoricoOpAction = () => {
  return (dispatch) => {};
};

export const listarOrdensExecAction = (props) => {
  return async (dispatch, getState) => {
    const { eventSourceOrdensExec } = getReducerStateStorePrincipal(
      getState(),
      "ordensExec",
    );

    const { token } = getReducerStateStorePrincipal(getState(), "principal");

    if (token) {
      const ordensExec = await listarOrdensExecAPI();

      dispatch({ type: LISTAR_ORDENS_EXECUCAO, payload: ordensExec });

      setTimeout(
        () =>
          atualizarOrdensExec({
            dispatch,
            token,
            eventSourceOrdensExec,
            listaOrdensExec: ordensExec,
          }),
        3000,
      );
    }
  };
};

export const abrirOrdemNoMultilegAction = (props, acao = "") => {
  return async (dispatch, getState) => {
    travarDestravarClique("travar", "menusTelaPrincipal");

    const { token } = getReducerStateStorePrincipal(getState(), "principal");
    const {
      multilegReducer: {
        eventSourceCotacao,
        setIntervalCotacoesMultileg,
        multileg,
        cotacoesMultileg,
      },
      systemReducer: { isOpenMultileg },
      ordersExecReducer: { ordemAtual },
    } = getState();

    const clonedMultilegTabs = cloneMultilegTabs(multileg);

    //Abrir Multileg
    props.atualizarDivKeyAction("multileg");

    //Se o multileg não estiver aberto, remove a primeira aba e abre o mesmo
    if (!isOpenMultileg) {
      clonedMultilegTabs.pop();
      dispatch(abrirItemBarraLateralAction(props, "isOpenMultileg"));
    } else {
      //Traz para primeiro plano se já estiver aberto
      document.getElementById("multileg").style.zIndex = props.zIndex + 1;
      props.aumentarZindexAction("multileg", props.zIndex, true);
    }

    // Adicionar aba
    let result = addMultilegTab(clonedMultilegTabs);

    let updatedMultilegTabs = result.multilegTabs;
    let updatedMultilegQuotes = cloneMultilegQuotes(cotacoesMultileg);
    const indiceAba = updatedMultilegTabs.length - 1;
    //const arrayCodigos = [...new Set(item.offers.map(oferta => oferta.ativo))];

    try {
      for (const [indiceOferta, oferta] of ordemAtual.offers.entries()) {
        //Alterar ativo

        const dadosModificados = await updateMultilegTab({
          multilegTabs: updatedMultilegTabs,
          tabIndex: indiceAba,
          attributeName: "ativo",
          attributeValue: oferta.ativo,
        });

        updatedMultilegTabs = dadosModificados.multilegTabs;

        //Pesquisar ativo
        const data = await searchMultilegSymbolData({
          multilegTabs: updatedMultilegTabs,
          tabIndex: indiceAba,
          multilegQuotes: updatedMultilegQuotes,
        });
        updatedMultilegTabs = data.multilegTabs;
        updatedMultilegQuotes = data.multilegQuotes;

        const opcao = updatedMultilegTabs[indiceAba].opcoes.filter(
          (opcao) => opcao.symbol === oferta.ativo,
        );
        let tipo = "";
        if (opcao.length > 0) tipo = opcao[0].type.toLowerCase();
        else tipo = "acao";
        //Adicionar oferta
        const dadosMultileg = await addMultilegOffer({
          multilegTabs: updatedMultilegTabs,
          offerType: tipo,
          tabIndex: indiceAba,
          multilegQuotes: updatedMultilegQuotes,
        });
        updatedMultilegTabs = dadosMultileg.multilegTabs;
        updatedMultilegQuotes = dadosMultileg.multilegQuotes;

        const ofertaNova =
          updatedMultilegTabs[indiceAba].tabelaMultileg[indiceOferta];

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
        updatedMultilegTabs[indiceAba],
        "ultimo",
        updatedMultilegQuotes,
      ).toFixed(2);
      calculo = formatarNumero(calculo, 2, ".", ",");
      updatedMultilegTabs[indiceAba].preco = calculo;
    } catch (erro) {
      console.log(erro);
      alert(erro_exportar_ordens_multileg);
    }

    //Disparar atualizações feitas com objeto multileg
    result.abasMultileg = updatedMultilegTabs;

    dispatch(updateMultilegStateAction("multileg", result.abasMultileg));
    dispatch(updateMultilegStateAction("abaSelecionada", result.abaAtual));
    dispatch(
      updateMultilegStateAction("cotacoesMultileg", updatedMultilegQuotes),
    );

    updateMultilegQuotesAction({
      dispatch,
      multilegQuotes: updatedMultilegQuotes,
      eventSourceMultilegQuotes: eventSourceCotacao,
      setIntervalMultilegQuotes: setIntervalCotacoesMultileg,
      token,
    });
    travarDestravarClique("destravar", "menusTelaPrincipal");
  };
};

export const abrirOrdensBoletaAction = (props, event, acao) => {
  return async (dispatch, getState) => {
    const {
      ordersExecReducer: { ordemAtual },
    } = getState();

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
        ...retornaDadosOferta(ordemAtual, nome),
      },
      ultimaBoletaAbertaOrdemExec: nome,
    };

    if (nome) {
      props.receberDadosOrdemExecMainReducerAction(dados);
      props.abrirFormAction(event, props, "", nome);
    }
  };
};

export const cancelarOrdemExecAction = ({ idOrdem, token }) => {
  return async (dispatch) => {
    travarDestravarClique("travar", "ordens_execucao");
    await cancelarOrdemExecAPI(idOrdem);
    travarDestravarClique("destravar", "ordens_execucao");
  };
};

export const finalizarAMercadoAction = ({ idOrdem, token }) => {
  return async (dispatch) => {
    travarDestravarClique("travar", "ordens_execucao");
    await finalizarAMercadoAPI(idOrdem);
    travarDestravarClique("destravar", "ordens_execucao");
  };
};

export const aumentarQtdePrecoAction = (actionProps) => {
  return (dispatch) => {
    const { ordemAtual, valorSomar, modo } = actionProps;
    const { id } = ordemAtual;
    const ofertas = [...ordemAtual.offers];
    const arrayQtde = ofertas.map((oferta) => oferta.qtdeOferta);
    const mdc = calculoMDC(arrayQtde);

    if (modo === "qtde") {
      let acrescimo = 0;
      ofertas.forEach((oferta) => {
        const unidade = oferta.qtdeOferta / mdc;
        acrescimo += valorSomar * unidade;
      });
      incrementarQtdeOrdemExecAPI(id, acrescimo);
    } //
    else if (modo === "preco") {
      let precoTotal = 0;
      ofertas.forEach((oferta) => {
        const unidade = oferta.qtdeOferta / mdc;
        precoTotal += oferta.precoEnvio * unidade;
      });
      precoTotal += valorSomar;
      incrementarPrecoOrdemExecAPI(id, precoTotal);
    }
  };
};

const mapearOperacaoParaBoleta = (operacao) => {
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
    tabelaOrdens: [],
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
      (oferta, index) => index !== 0,
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
        tipo: "real",
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

// const atualizarOrdensExecAction = (props) => {
//   return (dispatch, getState) => {
//     const {
//       eventSourceOrdensExec,
//       tabelaOrdensExecucao,
//     } = getReducerStateStorePrincipal(getState(), "ordensExec");
//     const { token } = getReducerStateStorePrincipal(getState(), "principal");

//     atualizarOrdensExec({
//       dispatch,
//       listaOrdensExec: tabelaOrdensExecucao,
//       eventSourceOrdensExec,
//       token,
//     });
//   };
// };

const atualizarOrdensExec = ({
  dispatch,
  eventSourceOrdensExec,
  token,
  listaOrdensExec,
}) => {
  if (eventSourceOrdensExec) {
    eventSourceOrdensExec.close();
  }

  const eventSource = atualizarOrdensExecAPI({
    dispatch,
    listaOrdensExec,
    token,
  });

  dispatch(mudarVariavelOrdensExecAction("eventSourceOrdensExec", eventSource));

  return eventSource;
};
