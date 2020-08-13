import moment from "moment";
import {
  listarTabelaInicialTHLAPI,
  recalcularPrecosTHLAPI,
  pesquisarCombinacoesTHLAPI,
  travarDestravarClique,
  favoritarTHLAPI,
} from "api/API";
import { pesquisarListaStrikeTHLAPI } from "api/API";
import { atualizarPrecosTHLAPI, atualizarCotacaoAPI } from "api/ReativosAPI";
import { mudarVariavelTHL, mudarVariaveisTHL } from "./utils";
import { getReducerStateStorePrincipal } from "hooks/utils";

export const pesquisarAtivoTHLAPIAction = (codigo) => {
  return async (dispatch) => {
    const listaStrikes = await pesquisarListaStrikeTHLAPI(codigo);

    if (listaStrikes.length > 0) {
      dispatch(
        mudarVariaveisTHL({
          listaStrikes,
          ativoPesquisado: codigo.toUpperCase(),
        })
      );
    }
  };
};

export const listarTabelaInicialTHLAPIAction = () => {
  return async (dispatch, getState) => {
    const {
      tipo,
      strikeSelecionado,
      setIntervalPrecosTHL,
      ativoPesquisado: ativo,
      eventSourcePrecos,
    } = getReducerStateStorePrincipal(getState(), "thl");

    if (ativo && strikeSelecionado && tipo) {
      dispatch(mudarVariavelTHL("carregandoTabelaVencimentos", true));

      const { token } = getReducerStateStorePrincipal(getState(), "principal");

      const tabelaVencimentos = await listarTabelaInicialTHLAPI(
        ativo,
        strikeSelecionado,
        tipo
      );
      if (tabelaVencimentos.length > 0)
        atualizarPrecosTHL({
          tabelaVencimentos,
          dispatch,
          setIntervalPrecosTHL,
          sourcePrecos: eventSourcePrecos,
          token,
        });

      dispatch(
        mudarVariaveisTHL({
          opcoesStrike: mapearTabelaVencimentos(tabelaVencimentos),
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
  return async (dispatch, getState) => {
    dispatch(mudarVariavelTHL("carregandoTabelaVencimentos", true));

    const {
      ativoPesquisado,
      strikeSelecionado,
      tipo,
      eventSourcePrecos,
      setIntervalPrecosTHL,
      codigoCelulaSelecionada,
    } = getReducerStateStorePrincipal(getState(), "thl");

    const tabelaVencimentos = await recalcularPrecosTHLAPI(
      codigoCelulaSelecionada,
      ativoPesquisado,
      strikeSelecionado,
      tipo
    );

    const { token } = getReducerStateStorePrincipal(getState(), "principal");

    if (tabelaVencimentos.length) {
      atualizarPrecosTHL({
        tabelaVencimentos,
        sourcePrecos: eventSourcePrecos,
        dispatch,
        setIntervalPrecosTHL,
        token,
      });
    }
    setTimeout(() => {
      dispatch(
        mudarVariaveisTHL({
          opcoesStrike: mapearTabelaVencimentos(tabelaVencimentos),
          celulaCalculada: codigoCelulaSelecionada,
          booksSelecionados: [],
          carregandoTabelaVencimentos: false,
        })
      );
    }, 3000);
  };
};

const atualizarPrecosTHL = async ({
  tabelaVencimentos,
  sourcePrecos,
  dispatch,
  setIntervalPrecosTHL,
  token,
}) => {
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

  const source = atualizarPrecosTHLAPI({ ids, dispatch, token });
  dispatch(
    mudarVariaveisTHL({
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
      mudarVariaveisTHL({
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
      mudarVariaveisTHL({
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
    linha.codigos = {
      opcao1: item.components[0].stock,
      opcao2: item.components[1].stock,
    };
    linha.montagem = item.max;
    linha.desmontagem = item.min;
    linha.vencimento = item.expiration;
    linha.prazo = item.prazo;

    return linha;
  });

  return { tabelaCombinacoes, arrayCotacoes };
};

export function mapearTabelaVencimentos(dataTabela) {
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
}

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
  dispatch(mudarVariavelTHL("eventSourceCotacoesTHL", source));
};
