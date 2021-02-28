import {
  getTHLDataWithStrikeAPI,
  recalcularPrecosTHLAPI,
  pesquisarCombinacoesTHLAPI,
  setPointerWhileAwaiting,
  favoritarTHLAPI,
  pesquisarListaStrikeTHLAPI,
  getTHLInitialDataAPI,
} from "api/API";
import {
  atualizarPrecosTHLAPI,
  atualizarCotacaoTHLAPI,
} from "api/reactive/ReativosAPI";
import {
  mapearTabelaVencimentos,
  montarTabelaCombinacoes,
  updateManyTHLState,
} from "./utils";
import api from "api/apiConfig";
import { MainThunkAction } from "types/ThunkActions";
import {
  getProactiveThlQuotesAPI,
  getProactiveThlStructureAPI,
} from "api/proactive/ProativosAPI";

export const pesquisarAtivoTHLAPIAction = (): MainThunkAction => {
  return async (dispatch, getState) => {
    const {
      thlReducer: { ativoPesquisa },
    } = getState();

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

export const listarTabelaInicialTHLAPIAction = (
  initialLoad = false,
): MainThunkAction => {
  return async (dispatch, getState) => {
    const {
      thlReducer: {
        tipo: type,
        strikeSelecionado: selectedStrike,
        ativoPesquisado: symbol,
      },
    } = getState();

    if (symbol && type) {
      dispatch(
        updateManyTHLState({
          carregandoTabelaVencimentos: true,
        }),
      );

      let quote = 0;
      let dayOscilation = 0;

      // quando fazer carga inicial
      let lines = [];
      let structures = [];
      if (initialLoad) {
        const data = await getTHLInitialDataAPI(symbol, type);
        lines = data.lines || [];
        structures = data.structures || [];

        const integerStrikes = [
          ...new Set(lines.map((line: any) => parseInt(line.strikeLine))),
        ];

        if (integerStrikes.length) {
          let strike = integerStrikes[0];
          if (integerStrikes.length >= 2) strike = integerStrikes[1];

          dispatch(
            updateManyTHLState({
              strikeSelecionado: strike as any,
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

        structures = data.structures || [];
        lines = data.lines || [];
      }

      try {
        const symbolResponse = await api.get(`price/quotes/${symbol}`);

        if (symbolResponse.data) {
          const { data } = symbolResponse;
          if (data.ultimo) {
            quote = data.ultimo;
          }
          if (data.oscilacao) {
            dayOscilation = data.oscilacao;
          }
        }
      } catch (error) {}

      dispatch(
        updateManyTHLState({
          opcoesStrike: mapearTabelaVencimentos(lines),
          carregandoTabelaVencimentos: false,
          codigoCelulaSelecionada: "",
          celulaCalculada: "",
          booksSelecionados: [],
          precosTabelaVencimentos: structures,
          quote,
          dayOscilation,
        }),
      );
    }
  };
};

export const recalcularPrecosTHLAPIAction = (): MainThunkAction => {
  return async (dispatch, getState) => {
    dispatch(
      updateManyTHLState({
        carregandoTabelaVencimentos: true,
      }),
    );

    const {
      thlReducer: {
        ativoPesquisado,
        strikeSelecionado,
        tipo,
        codigoCelulaSelecionada,
      },
    } = getState();

    const data = await recalcularPrecosTHLAPI(
      codigoCelulaSelecionada,
      ativoPesquisado,
      strikeSelecionado,
      tipo,
    );

    const { lines: tabelaVencimentos } = data;

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

export const startReactiveThlStructuresUpdateAction = (): MainThunkAction => {
  return (dispatch, getState) => {
    const {
      thlReducer: {
        esource_thlStructures,
        interval_thlStructures,
        opcoesStrike: thlLines,
        precosTabelaVencimentos: priceStructures,
      },
      systemReducer: { token },
    } = getState();

    if (esource_thlStructures && esource_thlStructures.close) {
      esource_thlStructures.close();
    }
    if (interval_thlStructures) {
      clearInterval(interval_thlStructures);
    }

    const idList = thlLines.reduce((acc: number[], curr) => {
      const idsSubArray = curr.structuresIds.map((id) => id);

      return [...acc, ...idsSubArray];
    }, []);

    const ids = [...new Set(idList)].join(",");

    if (ids) {
      const source = atualizarPrecosTHLAPI({
        ids,
        dispatch,
        token,
        priceStructures,
      });
      dispatch(
        updateManyTHLState({
          esource_thlStructures: source,
        }),
      );
    }
  };
};

export const startProactiveThlStructuresUpdateAction = (): MainThunkAction => {
  return (dispatch, getState) => {
    const {
      thlReducer: {
        esource_thlStructures,
        interval_thlStructures,
        opcoesStrike: thlLines,
      },
      systemReducer: { updateInterval },
    } = getState();

    if (esource_thlStructures) {
      esource_thlStructures.close();
    }
    if (interval_thlStructures) {
      clearInterval(interval_thlStructures);
    }

    const idList = thlLines.reduce((acc: number[], curr) => {
      const idsSubArray = curr.structuresIds.map((id) => id);

      return [...acc, ...idsSubArray];
    }, []);

    const ids = [...new Set(idList)].join(",");

    if (ids) {
      const interval = setInterval(async () => {
        const data = await getProactiveThlStructureAPI(ids);

        dispatch(
          updateManyTHLState({
            precosTabelaVencimentos: data,
          }),
        );
      }, updateInterval);

      dispatch(
        updateManyTHLState({
          interval_thlStructures: interval,
        }),
      );
    }
  };
};

interface FavoriteProps {
  idCelulaSelecionada: number;
}

export const favoritarTHLAPIAction = (
  actionProps: FavoriteProps,
): MainThunkAction => {
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

export const criarAlertaTHLAPIAction = (actionProps: any): MainThunkAction => {
  return (dispatch) => {
    // const { idCelulaSelecionada } = actionProps;
  };
};

export const pesquisarCombinacoesTHLAPIAction = (): MainThunkAction => {
  return async (dispatch, getState) => {
    const {
      thlReducer: { ativoPesquisa },
    } = getState();

    dispatch(
      updateManyTHLState({
        booksSelecionados: [],
        carregandoCombinacoes: true,
        codigoCelulaSelecionada: "",
        idCelulaSelecionada: null,
      }),
    );
    const combinacoes = await pesquisarCombinacoesTHLAPI(ativoPesquisa);

    //limpar setInterval e event Source
    let tabelaCombinacoes = [];
    let arrayCotacoes: Array<{ codigo: any; cotacao: any }> = [];

    if (combinacoes.length) {
      const result = montarTabelaCombinacoes(combinacoes);
      tabelaCombinacoes = result.tabelaCombinacoes;
      arrayCotacoes = result.arrayCotacoes;
    }

    dispatch(
      updateManyTHLState({
        carregandoCombinacoes: false,
        combinacoesTabela: tabelaCombinacoes,
        arrayCotacoes,
      }),
    );
  };
};

export const startReactiveThlQuoteUpdateAction = (): MainThunkAction => {
  return (dispatch, getState) => {
    const {
      thlReducer: {
        esource_thlQuotes,
        interval_thlQuotes,
        arrayCotacoes: thlQuotes,
      },
      systemReducer: { token },
    } = getState();

    if (interval_thlQuotes) {
      clearInterval(interval_thlQuotes);
    }
    if (esource_thlQuotes && esource_thlQuotes.close) {
      esource_thlQuotes.close();
    }

    let codigos = "";
    thlQuotes.forEach((ativo) => {
      codigos += ativo.codigo + ",";
    });

    codigos = codigos.substring(0, codigos.length - 1);

    if (codigos) {
      const source = atualizarCotacaoTHLAPI({
        dispatch,
        arrayCotacoes: thlQuotes,
        codigos,
        token,
      });
      dispatch(
        updateManyTHLState({
          esource_thlQuotes: source,
        }),
      );
    }
  };
};

export const startProactiveThlQuoteUpdateAction = (): MainThunkAction => {
  return (dispatch, getState) => {
    const {
      thlReducer: {
        esource_thlQuotes,
        interval_thlQuotes,
        arrayCotacoes: thlQuotes,
      },
      systemReducer: { updateInterval },
    } = getState();

    if (interval_thlQuotes) {
      clearInterval(interval_thlQuotes);
    }
    if (esource_thlQuotes && esource_thlQuotes.close) {
      esource_thlQuotes.close();
    }

    const symbolArray: string[] = [];

    thlQuotes.forEach((ativo) => {
      symbolArray.push(ativo.codigo);
    });

    const symbols = symbolArray.join(",");

    if (symbols) {
      const interval = setInterval(async () => {
        const data = await getProactiveThlQuotesAPI(symbols);

        dispatch(
          updateManyTHLState({
            arrayCotacoes: data,
          }),
        );
      }, updateInterval);

      dispatch(
        updateManyTHLState({
          interval_thlQuotes: interval,
        }),
      );
    }
  };
};
