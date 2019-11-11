import {
  MUDAR_VARIAVEL_ORDENS_EXEC,
  ADICIONAR_ABA
} from "constants/MenuActionTypes";
import {
  listarOrdensExecAPI,
  travarDestravarClique,
  cancelarOrdemExecAPI,
  finalizarAMercadoAPI,
  incrementarQtdeOrdemExecAPI
} from "components/api/API";
import { LISTAR_ORDENS_EXECUCAO } from "constants/ApiActionTypes";
import {
  atualizarCotacaoAction,
  adicionarOferta,
  atualizarBookAction
} from "components/redux/actions/menu_actions/MultilegActions";
import {
  adicionarAba,
  modificarAba
} from "components/redux/actions/menu_actions/MultilegActions";
import { pesquisaAtivo } from "components/redux/actions/api_actions/MenuAPIAction";
import { erro_exportar_ordens_multileg } from "constants/AlertaErros";
import { calculoPreco } from "components/forms/multileg_/CalculoPreco";
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

export const listarOrdensExecAction = () => {
  return async dispatch => {
    const ordensExec = await listarOrdensExecAPI();

    dispatch({ type: LISTAR_ORDENS_EXECUCAO, payload: ordensExec });
  };
};

export const abrirOrdemNoMultilegAction = (props, item, acao = "") => {
  return async dispatch => {
    travarDestravarClique("travar", "menusTelaPrincipal");

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
    const indiceAba = multileg.length - 1;
    //const arrayCodigos = [...new Set(item.offers.map(oferta => oferta.ativo))];

    try {
      for (const [indiceOferta, oferta] of item.offers.entries()) {
        //Alterar ativo
        multileg = await modificarAba(
          multileg,
          indiceAba,
          "ativo",
          oferta.ativo
        );

        //Pesquisar ativo
        multileg = await pesquisaAtivo(multileg, indiceAba);

        const opcao = multileg[indiceAba].opcoes.filter(
          opcao => opcao.symbol === oferta.ativo
        );
        let tipo = "";
        if (opcao.length > 0) tipo = opcao[0].type.toLowerCase();
        else tipo = "acao";
        //Adicionar oferta
        multileg = await adicionarOferta(multileg, tipo, indiceAba);
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

      let calculo = calculoPreco(multileg[indiceAba], "ultimo").toFixed(2);
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
    atualizarCotacaoAction(dispatch, props, objMultileg.abasMultileg);
    atualizarBookAction(dispatch, props, objMultileg.abasMultileg);
    travarDestravarClique("destravar", "menusTelaPrincipal");
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

export const aumentarQtdeAction = (id, qtde) => {
  return dispatch => {
    incrementarQtdeOrdemExecAPI(id, qtde);
  };
};
