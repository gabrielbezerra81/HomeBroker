import {
  listarTabelaInicialTHLAPI,
  atualizarPrecosTHLAPI,
} from "components/api/API";
import { MUDAR_VARIAVEL_THL } from "constants/MenuActionTypes";
import {
  pesquisarListaStrikeTHLAPI,
  travarDestravarClique,
} from "components/api/API";

export const pesquisarAtivoTHLAPIAction = (codigo) => {
  return async (dispatch) => {
    travarDestravarClique("travar", "thl");
    const listaStrikes = await pesquisarListaStrikeTHLAPI(codigo);

    if (listaStrikes.length > 0) {
      dispatch({
        type: MUDAR_VARIAVEL_THL,
        payload: { nome: "listaStrikes", valor: listaStrikes },
      });
      dispatch({
        type: MUDAR_VARIAVEL_THL,
        payload: { nome: "ativoPesquisado", valor: codigo.toUpperCase() },
      });
    }
    travarDestravarClique("destravar", "thl");
  };
};

export const listarTabelaInicialTHLAPIAction = (
  ativo,
  strikeSelecionado,
  tipo,
  sourcePrecos,
  precosTabela,
  setPrecosIntervalo
) => {
  return async (dispatch) => {
    if (ativo && strikeSelecionado && tipo) {
      dispatch({
        type: MUDAR_VARIAVEL_THL,
        payload: { nome: "carregandoTabelaVencimentos", valor: true },
      });

      const tabelaVencimentos = await listarTabelaInicialTHLAPI(
        ativo,
        strikeSelecionado,
        tipo
      );
      if (tabelaVencimentos.length > 0)
        atualizarPrecosTHL(
          tabelaVencimentos,
          sourcePrecos,
          dispatch,
          precosTabela,
          setPrecosIntervalo
        );
      dispatch({
        type: MUDAR_VARIAVEL_THL,
        payload: {
          nome: "opcoesStrike",
          valor: tabelaVencimentos,
        },
      });
      dispatch({
        type: MUDAR_VARIAVEL_THL,
        payload: { nome: "carregandoTabelaVencimentos", valor: false },
      });
    }
  };
};

const atualizarPrecosTHL = async (
  tabelaVencimentos,
  sourcePrecos,
  dispatch,
  precosTabela,
  setPrecosIntervalo
) => {
  if (sourcePrecos) {
    sourcePrecos.close();
  }
  if (setPrecosIntervalo) {
    clearInterval(setPrecosIntervalo);
  }

  let ids = "";

  tabelaVencimentos.forEach((linhaTabela) => {
    linhaTabela.structuresIds.forEach((id) => {
      if (!ids.includes(id)) ids += id + ",";
    });
  });

  ids = ids.substring(0, ids.length - 1);

  const source = await atualizarPrecosTHLAPI(ids, dispatch, precosTabela);

  dispatch({
    type: MUDAR_VARIAVEL_THL,
    payload: { nome: "eventSourcePrecos", valor: source },
  });
};
