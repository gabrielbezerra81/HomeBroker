import {
  listarTabelaInicialTHLAPI,
  recalcularPrecosTHLAPI,
} from "components/api/API";
import { pesquisarListaStrikeTHLAPI } from "components/api/API";
import { atualizarPrecosTHLAPI } from "components/api/ReativosAPI";
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
  setIntervalPrecosTHL,
  codigoCelulaSelecionada
) => {
  return async (dispatch) => {
    if (ativo && strikeSelecionado && tipo && !codigoCelulaSelecionada) {
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
          setIntervalPrecosTHL
        );
      dispatch(mudarVariavelTHLAction("opcoesStrike", tabelaVencimentos));
      dispatch(mudarVariavelTHLAction("carregandoTabelaVencimentos", false));
      dispatch(mudarVariavelTHLAction("codigoCelulaSelecionada", ""));
      dispatch(mudarVariavelTHLAction("booksSelecionados", []));
    }
  };
};

export const recalcularPrecosTHLAPIAction = (thlState) => {
  return async (dispatch) => {
    const {
      ativoPesquisado,
      strikeSelecionado,
      tipo,
      eventSourcePrecos,
      setIntervalPrecosTHL,
      codigoCelulaSelecionada,
    } = thlState;
    dispatch(mudarVariavelTHLAction("carregandoTabelaVencimentos", true));

    const opcoesRecalculadas = await recalcularPrecosTHLAPI(
      codigoCelulaSelecionada,
      ativoPesquisado,
      strikeSelecionado,
      tipo
    );

    if (opcoesRecalculadas.length) {
      dispatch(mudarVariavelTHLAction("opcoesStrike", opcoesRecalculadas));
      dispatch(mudarVariavelTHLAction("booksSelecionados", []));
      atualizarPrecosTHL(
        opcoesRecalculadas,
        eventSourcePrecos,
        dispatch,
        setIntervalPrecosTHL
      );
    }
    setTimeout(
      () =>
        dispatch(mudarVariavelTHLAction("carregandoTabelaVencimentos", false)),
      3000
    );
  };
};

const atualizarPrecosTHL = async (
  tabelaVencimentos,
  sourcePrecos,
  dispatch,
  setIntervalPrecosTHL
) => {
  if (sourcePrecos) {
    sourcePrecos.close();
  }
  if (setIntervalPrecosTHL) {
    clearInterval(setIntervalPrecosTHL);
  }

  let ids = "";

  tabelaVencimentos.forEach((linhaTabela) => {
    linhaTabela.structuresIds.forEach((id) => {
      if (id && !ids.includes(id)) ids += id + ",";
    });
  });

  ids = ids.substring(0, ids.length - 1);

  const source = atualizarPrecosTHLAPI(ids, dispatch);
  dispatch(mudarVariavelTHLAction("eventSourcePrecos", source));
  dispatch(mudarVariavelTHLAction("precosTabelaVencimentos", []));
};
