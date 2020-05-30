import {
  listarTabelaInicialTHLAPI,
  recalcularPrecosTHLAPI,
  pesquisarCombinacoesTHLAPI,
  travarDestravarClique,
  favoritarTHLAPI,
} from "components/api/API";
import { pesquisarListaStrikeTHLAPI } from "components/api/API";
import {
  atualizarPrecosTHLAPI,
  atualizarCotacaoAPI,
} from "components/api/ReativosAPI";
import {
  mudarVariavelTHLAction,
  mudarVariaveisTHLAction,
} from "components/redux/actions/menu_actions/THLActions";
import { mapTabelaVencimentos } from "components/redux/reducers/menu_reducer/THLReducer";

export const pesquisarAtivoTHLAPIAction = (codigo) => {
  return async (dispatch) => {
    const listaStrikes = await pesquisarListaStrikeTHLAPI(codigo);

    if (listaStrikes.length > 0) {
      dispatch(
        mudarVariaveisTHLAction({
          listaStrikes,
          ativoPesquisado: codigo.toUpperCase(),
        })
      );
    }
  };
};

export const listarTabelaInicialTHLAPIAction = (props) => {
  return async (dispatch) => {
    const {
      sourcePrecos,
      setIntervalPrecosTHL,
      ativoPesquisado,
      strikeSelecionado,
      tipo,
    } = props;
    const ativo = ativoPesquisado;
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
          setIntervalPrecosTHL
        );

      dispatch(
        mudarVariaveisTHLAction({
          opcoesStrike: mapTabelaVencimentos(tabelaVencimentos),
          carregandoTabelaVencimentos: false,
          codigoCelulaSelecionada: "",
          celulaCalculada: "",
          booksSelecionados: [],
        })
      );
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
      atualizarPrecosTHL(
        opcoesRecalculadas,
        eventSourcePrecos,
        dispatch,
        setIntervalPrecosTHL
      );
    }
    setTimeout(() => {
      dispatch(
        mudarVariaveisTHLAction({
          opcoesStrike: mapTabelaVencimentos(opcoesRecalculadas),
          celulaCalculada: codigoCelulaSelecionada,
          booksSelecionados: [],
          carregandoTabelaVencimentos: false,
        })
      );
    }, 3000);
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
  dispatch(
    mudarVariaveisTHLAction({
      eventSourcePrecos: source,
      precosTabelaVencimentos: [],
    })
  );
};

export const favoritarTHLAPIAction = (actionProps) => {
  return async (dispatch) => {
    const { idCelulaSelecionada, token } = actionProps;

    travarDestravarClique("travar", "thl");
    const json = { structure: { id: idCelulaSelecionada } };
    await favoritarTHLAPI(JSON.stringify(json), token);
    travarDestravarClique("destravar", "thl");
  };
};

export const criarAlertaTHLAPIAction = (actionProps) => {
  return (dispatch) => {
    // const { idCelulaSelecionada } = actionProps;
  };
};

export const pesquisarCombinacoesTHLAPIAction = (actionProps) => {
  return async (dispatch) => {
    const { ativoPesquisa } = actionProps;
    dispatch(
      mudarVariaveisTHLAction({
        booksSelecionados: [],
        pesquisandoAtivo: true,
        carregandoCombinacoes: true,
        codigoCelulaSelecionada: "",
        idCelulaSelecionada: null,
      })
    );
    const combinacoes = await pesquisarCombinacoesTHLAPI(ativoPesquisa);

    //limpar setInterval e eventSource
    let tabelaCombinacoes = [],
      arrayCotacoes = [];

    if (combinacoes.length) {
      const result = montarTabelaCombinacoes(combinacoes);
      tabelaCombinacoes = result.tabelaCombinacoes;
      arrayCotacoes = result.arrayCotacoes;

      atualizarCotacaoTHL({ ...actionProps, dispatch, arrayCotacoes });
    }

    dispatch(
      mudarVariaveisTHLAction({
        pesquisandoAtivo: false,
        carregandoCombinacoes: false,
        combinacoesTabela: tabelaCombinacoes,
        arrayCotacoes,
      })
    );
  };
};

export const montarTabelaCombinacoes = (tabelaAPI) => {
  const arrayCotacoes = [...new Set(tabelaAPI.map((item) => item.symbol))].map(
    (codigo) => {
      const cotacao = "";
      return { codigo, cotacao };
    }
  );

  const tabelaCombinacoes = tabelaAPI.map((item, indice) => {
    const linha = {};
    linha.id = item.id;
    linha.estrategia = item.name;
    linha.grupo = item.group || "";
    linha.acaoUlt = { acao: item.symbol };
    linha.spread = +(
      item.components[0].stock.strike - item.components[1].stock.strike
    ).toFixed(2);
    linha.estrutura = { ...item };
    linha.codigos = "";
    linha.montagem = "";
    linha.desmontagem = "";
    linha.vencimento = item.expiration;
    linha.prazo = item.prazo;

    return linha;
  });

  return { tabelaCombinacoes, arrayCotacoes };
};

const atualizarCotacaoTHL = (actionProps) => {
  const {
    dispatch,
    arrayCotacoes,
    setIntervalCotacoesTHL,
    eventSourceCotacoesTHL,
  } = actionProps;
  if (setIntervalCotacoesTHL) clearInterval(setIntervalCotacoesTHL);
  if (eventSourceCotacoesTHL) eventSourceCotacoesTHL.close();

  let codigos = "";
  arrayCotacoes.forEach((ativo) => {
    codigos += ativo.codigo + ",";
  });
  codigos = codigos.substring(0, codigos.length - 1);

  const source = atualizarCotacaoAPI(dispatch, codigos, "thl", arrayCotacoes);
  dispatch(mudarVariavelTHLAction("eventSourceCotacoesTHL", source));
};
