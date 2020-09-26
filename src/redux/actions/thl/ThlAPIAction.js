import moment from "moment";
import {
  getTHLDataWithStrikeAPI,
  recalcularPrecosTHLAPI,
  pesquisarCombinacoesTHLAPI,
  setPointerWhileAwaiting,
  favoritarTHLAPI,
  pesquisarListaStrikeTHLAPI,
  getTHLInitialDataAPI,
} from "api/API";
import { atualizarPrecosTHLAPI, atualizarCotacaoTHLAPI } from "api/ReativosAPI";
import { updateOneTHLState, updateManyTHLState } from "./utils";
import { getReducerStateStorePrincipal } from "hooks/utils";

export const pesquisarAtivoTHLAPIAction = () => {
  return async (dispatch, getState) => {
    const { ativoPesquisa } = getReducerStateStorePrincipal(getState(), "thl");

    const listaStrikes = await pesquisarListaStrikeTHLAPI(ativoPesquisa);

    if (listaStrikes.length > 0) {
      dispatch(
        updateManyTHLState({
          listaStrikes,
          ativoPesquisado: ativoPesquisa.toUpperCase(),
        }),
      );
    }
  };
};

export const listarTabelaInicialTHLAPIAction = (initialLoad = false) => {
  return async (dispatch, getState) => {
    const {
      tipo: type,
      strikeSelecionado: selectedStrike,
      setIntervalPrecosTHL,
      ativoPesquisado: symbol,
      eventSourcePrecos,
    } = getReducerStateStorePrincipal(getState(), "thl");

    if (symbol && type) {
      dispatch(
        updateOneTHLState({
          attributeName: "carregandoTabelaVencimentos",
          attributeValue: true,
        }),
      );

      const { token } = getReducerStateStorePrincipal(getState(), "principal");

      // quando fazer carga inicial
      let lines = [];
      let structures = [];
      if (initialLoad) {
        const data = await getTHLInitialDataAPI(symbol, type);
        lines = data.lines;
        structures = data.structures;

        const integerStrikes = [
          ...new Set(lines.map((line) => parseInt(line.strikeLine))),
        ];

        if (integerStrikes.length) {
          let strike = integerStrikes[0];
          if (integerStrikes.length >= 2) strike = integerStrikes[1];

          dispatch(
            updateManyTHLState({
              strikeSelecionado: strike,
              shouldUpdateWithStrikeChange: false,
            }),
          );
        }
      } //
      else {
        const data = await getTHLDataWithStrikeAPI(
          symbol,
          selectedStrike,
          type,
        );

        structures = data.structures;
        lines = data.lines;
      }

      if (lines.length > 0) {
        atualizarPrecosTHL({
          tabelaVencimentos: lines,
          dispatch,
          setIntervalPrecosTHL,
          sourcePrecos: eventSourcePrecos,
          token,
          priceStructures: structures,
        });
      }

      dispatch(
        updateManyTHLState({
          opcoesStrike: mapearTabelaVencimentos(lines),
          carregandoTabelaVencimentos: false,
          codigoCelulaSelecionada: "",
          celulaCalculada: "",
          booksSelecionados: [],
          precosTabelaVencimentos: structures,
        }),
      );
    }
  };
};

export const recalcularPrecosTHLAPIAction = () => {
  return async (dispatch, getState) => {
    dispatch(
      updateOneTHLState({
        attributeName: "carregandoTabelaVencimentos",
        attributeValue: true,
      }),
    );

    const {
      ativoPesquisado,
      strikeSelecionado,
      tipo,
      eventSourcePrecos,
      setIntervalPrecosTHL,
      codigoCelulaSelecionada,
      precosTabelaVencimentos,
    } = getReducerStateStorePrincipal(getState(), "thl");

    const tabelaVencimentos = await recalcularPrecosTHLAPI(
      codigoCelulaSelecionada,
      ativoPesquisado,
      strikeSelecionado,
      tipo,
    );

    const { token } = getReducerStateStorePrincipal(getState(), "principal");

    if (tabelaVencimentos.length) {
      atualizarPrecosTHL({
        tabelaVencimentos,
        sourcePrecos: eventSourcePrecos,
        dispatch,
        setIntervalPrecosTHL,
        token,
        priceStructures: precosTabelaVencimentos,
      });
    }
    setTimeout(() => {
      dispatch(
        updateManyTHLState({
          opcoesStrike: mapearTabelaVencimentos(tabelaVencimentos),
          celulaCalculada: codigoCelulaSelecionada,
          booksSelecionados: [],
          carregandoTabelaVencimentos: false,
        }),
      );
    }, 3000);
  };
};

const atualizarPrecosTHL = async ({
  tabelaVencimentos,
  priceStructures,
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

  const ids = [
    ...new Set(
      tabelaVencimentos.reduce((acc, curr) => {
        const idsSubArray = curr.structuresIds.map((id) => id);

        return [...acc, ...idsSubArray];
      }, []),
    ),
  ].join(",");

  if (ids) {
    const source = atualizarPrecosTHLAPI({
      ids,
      dispatch,
      token,
      priceStructures,
    });
    dispatch(
      updateManyTHLState({
        eventSourcePrecos: source,
      }),
    );
  }
};

export const favoritarTHLAPIAction = (actionProps) => {
  return async (dispatch) => {
    const { idCelulaSelecionada } = actionProps;

    setPointerWhileAwaiting({
      lockMode: "travar",
      id: "thl",
    });
    const favoriteData = { structure: { id: idCelulaSelecionada } };
    await favoritarTHLAPI(favoriteData);
    setPointerWhileAwaiting({
      lockMode: "destravar",
      id: "thl",
    });
  };
};

export const criarAlertaTHLAPIAction = (actionProps) => {
  return (dispatch) => {
    // const { idCelulaSelecionada } = actionProps;
  };
};

export const pesquisarCombinacoesTHLAPIAction = () => {
  return async (dispatch, getState) => {
    const {
      ativoPesquisa,
      eventSourceCotacoesTHL,
      setIntervalCotacoesTHL,
    } = getReducerStateStorePrincipal(getState(), "thl");
    const { token } = getReducerStateStorePrincipal(getState(), "principal");

    dispatch(
      updateManyTHLState({
        booksSelecionados: [],
        pesquisandoAtivo: true,
        carregandoCombinacoes: true,
        codigoCelulaSelecionada: "",
        idCelulaSelecionada: null,
      }),
    );
    const combinacoes = await pesquisarCombinacoesTHLAPI(ativoPesquisa);

    //limpar setInterval e eventSource
    let tabelaCombinacoes = [],
      arrayCotacoes = [];

    if (combinacoes.length) {
      const result = montarTabelaCombinacoes(combinacoes);
      tabelaCombinacoes = result.tabelaCombinacoes;
      arrayCotacoes = result.arrayCotacoes;

      atualizarCotacaoTHL({
        dispatch,
        arrayCotacoes,
        token,
        eventSourceCotacoesTHL,
        setIntervalCotacoesTHL,
      });
    }

    dispatch(
      updateManyTHLState({
        pesquisandoAtivo: false,
        carregandoCombinacoes: false,
        combinacoesTabela: tabelaCombinacoes,
        arrayCotacoes,
      }),
    );
  };
};

export const montarTabelaCombinacoes = (tabelaAPI) => {
  const arrayCotacoes = [...new Set(tabelaAPI.map((item) => item.symbol))].map(
    (codigo) => {
      const cotacao = "";
      return { codigo, cotacao };
    },
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

const atualizarCotacaoTHL = ({
  dispatch,
  arrayCotacoes,
  setIntervalCotacoesTHL,
  eventSourceCotacoesTHL,
  token,
}) => {
  if (setIntervalCotacoesTHL) clearInterval(setIntervalCotacoesTHL);
  if (eventSourceCotacoesTHL) eventSourceCotacoesTHL.close();

  let codigos = "";
  arrayCotacoes.forEach((ativo) => {
    codigos += ativo.codigo + ",";
  });

  codigos = codigos.substring(0, codigos.length - 1);

  if (codigos) {
    const source = atualizarCotacaoTHLAPI({
      dispatch,
      arrayCotacoes,
      codigos,
      token,
    });
    dispatch(
      updateOneTHLState({
        attributeName: "eventSourceCotacoesTHL",
        attributeValue: source,
      }),
    );
  }
};
