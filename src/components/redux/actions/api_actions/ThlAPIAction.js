import {
  listarTabelaInicialTHLAPI,
  atualizarPrecosTHLAPI,
} from "components/api/API";
import { pesquisarListaStrikeTHLAPI } from "components/api/API";
import { mudarVariavelTHLAction } from "components/redux/actions/menu_actions/THLActions";

export const pesquisarAtivoTHLAPIAction = (codigo) => {
  return async (dispatch) => {
    dispatch(mudarVariavelTHLAction("pesquisandoAtivo", true));
    const listaStrikes = await pesquisarListaStrikeTHLAPI(codigo);

    if (listaStrikes.length > 0) {
      dispatch(mudarVariavelTHLAction("listaStrikes", listaStrikes));
      dispatch(mudarVariavelTHLAction("ativoPesquisado", codigo.toUpperCase()));
    }
    dispatch(mudarVariavelTHLAction("pesquisandoAtivo", false));
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
      dispatch(mudarVariavelTHLAction("carregandoTabelaVencimentos", true));

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
      dispatch(mudarVariavelTHLAction("opcoesStrike", tabelaVencimentos));
      dispatch(mudarVariavelTHLAction("carregandoTabelaVencimentos", false));
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
  dispatch(mudarVariavelTHLAction("eventSourcePrecos", source));
};
