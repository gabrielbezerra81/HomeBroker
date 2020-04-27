import moment from "moment";
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
  sourcePrecos
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
      if (tabelaVencimentos)
        atualizarPrecosTHL(tabelaVencimentos, sourcePrecos, dispatch);
      dispatch({
        type: MUDAR_VARIAVEL_THL,
        payload: {
          nome: "opcoesStrike",
          valor: mapTabelaVencimentos(tabelaVencimentos),
        },
      });
      dispatch({
        type: MUDAR_VARIAVEL_THL,
        payload: { nome: "carregandoTabelaVencimentos", valor: false },
      });
    } // caso os parametros não estejam preenchidos
    else {
      dispatch({
        type: MUDAR_VARIAVEL_THL,
        payload: { nome: "opcoesStrike", valor: [] },
      });
    }
  };
};

const atualizarPrecosTHL = async (
  tabelaVencimentos,
  sourcePrecos,
  dispatch
) => {
  if (sourcePrecos) {
    sourcePrecos.close();
  }

  let ids = "";

  tabelaVencimentos.forEach((linhaTabela) => {
    linhaTabela.structuresIds.forEach((id) => {
      if (!ids.includes(id)) ids += id + ",";
    });
  });

  ids = ids.substring(0, ids.length - 1);

  const source = await atualizarPrecosTHLAPI(ids);

  dispatch({
    type: MUDAR_VARIAVEL_THL,
    payload: { nome: "eventSourcePrecos", valor: source },
  });
};

export const mapTabelaVencimentos = (dataTabela) => {
  return dataTabela.map((linhaStrike) => {
    const novaLinhaStrike = {
      strikeLine: linhaStrike.strikeLine,
      structuresIds: [...linhaStrike.structuresIds],
    };
    novaLinhaStrike.stocks = linhaStrike.stocks.map((stock) => {
      const data = moment(stock.endBusiness, "DD-MM-YYYY HH:mm:ss");
      const novoStock = { ...stock, vencimento: data };

      return novoStock;
    });

    return novaLinhaStrike;
  });
};
