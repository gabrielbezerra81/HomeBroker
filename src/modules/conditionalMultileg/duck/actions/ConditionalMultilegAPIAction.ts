import {
  pesquisarAtivoMultilegAPI,
  enviarOrdemAPI,
  setPointerWhileAwaiting,
  criarAlertaOperacaoAPI,
  criarPosicaoMultilegAPI,
  addBoxStructureAPI,
  getMultilegExecStrategiesAPI,
} from "api/API";
import {
  cloneMultilegTabs,
  updateMultilegStateAction,
} from "./ConditionalMultilegActions";
import {
  mountMultilegOrder,
  validateMultilegOrder,
  AddNewMultilegQuote,
  findClosestStrike,
  updateOneMultilegState,
  updateManyMultilegState,
} from "./utils";
import { MainThunkAction } from "types/ThunkActions";
import {
  MultilegQuote,
  MultilegTab,
  MultilegOption,
} from "../../types/multileg";
import produce from "immer";
import { LISTAR_ORDENS_EXECUCAO } from "constants/ApiActionTypes";
import { atualizarCotacaoMultilegAPI } from "api/reactive/ReativosAPI";
import { getProactiveMultilegQuotesAPI } from "api/proactive/ProativosAPI";

////

export const searchMultilegSymbolAPIAction = (
  tabIndex: number,
): MainThunkAction => {
  return async (dispatch, getState) => {
    const {
      multilegReducer: { multileg, cotacoesMultileg },
    } = getState();

    const data = await searchMultilegSymbolData({
      multilegTabs: multileg,
      tabIndex,
      multilegQuotes: cotacoesMultileg,
    });

    dispatch(
      updateManyMultilegState({
        cotacoesMultileg: data.multilegQuotes,
        multileg: data.multilegTabs,
      }),
    );
  };
};

interface searchSymbolData {
  multilegTabs: MultilegTab[];
  tabIndex: number;
  multilegQuotes: MultilegQuote[];
}

export const searchMultilegSymbolData = async ({
  multilegQuotes,
  multilegTabs,
  tabIndex,
}: searchSymbolData) => {
  let updatedMultilegTabs = cloneMultilegTabs(multilegTabs);
  let multilegTab = updatedMultilegTabs[tabIndex];
  const symbol = multilegTab.ativo;

  const data = await pesquisarAtivoMultilegAPI(symbol);

  if (data) {
    AddNewMultilegQuote({
      multilegQuotes,
      symbol,
      quote: data.cotacaoAtual,
    });

    const symbolIsOption = symbol !== data.ativoPrincipal ? true : false;

    multilegTab.opcoes = [...data.opcoes].sort(
      (a: MultilegOption, b: MultilegOption) => a.strike - b.strike,
    );
    multilegTab.vencimento = [...data.vencimentos];
    multilegTab.variacao = data.variacao;
    multilegTab.vencimentoSelecionado = multilegTab.opcoes[0].expiration;
    multilegTab.strikeSelecionado = findClosestStrike({
      options: data.opcoes,
      symbolQuote: data.cotacaoAtual,
      symbol,
      symbolIsOption,
    });
    multilegTab.ativoAtual = data.ativoPrincipal;
    multilegTab.market = data.market;
  }

  return { multilegTabs: updatedMultilegTabs, multilegQuotes };
};

export const sendMultilegOrderAction = (tabIndex: number): MainThunkAction => {
  return async (dispatch, getState) => {
    const {
      multilegReducer: { multileg },
      systemReducer: { selectedAccount },
      ordersExecReducer: { tabelaOrdensExecucao },
    } = getState();

    const mountOrderProps = {
      multilegTabs: multileg,
      selectedAccount: selectedAccount,
      tabIndex,
    };

    const multilegRequestData = mountMultilegOrder(mountOrderProps);

    setPointerWhileAwaiting({
      lockMode: "travar",
      id: "conditionalMultileg",
      parentID: "body",
    });

    if (validateMultilegOrder(mountOrderProps)) {
      const data = await enviarOrdemAPI(multilegRequestData);

      if (data && data.length) {
        const updatedOrders = produce(tabelaOrdensExecucao, (draft) => {
          draft.unshift(data[0]);
        });
        dispatch({ type: LISTAR_ORDENS_EXECUCAO, payload: updatedOrders });
      }
    }

    setPointerWhileAwaiting({
      lockMode: "destravar",
      id: "conditionalMultileg",
      parentID: "body",
    });
  };
};

export const createMultilegAlertAction = (
  tabIndex: number,
): MainThunkAction => {
  return async (dispatch, getState) => {
    const {
      multilegReducer: { multileg, alerts },
      systemReducer: { selectedAccount },
    } = getState();

    const { param, operator, comment } = multileg[tabIndex];

    const mountOrderProps = {
      multilegTabs: multileg,
      selectedAccount: selectedAccount,
      tabIndex,
      comment,
    };

    const multilegRequestData = mountMultilegOrder(mountOrderProps);

    setPointerWhileAwaiting({ lockMode: "travar", id: "conditionalMultileg" });
    if (validateMultilegOrder(mountOrderProps)) {
      const data = await criarAlertaOperacaoAPI({
        param,
        operator,
        data: multilegRequestData,
      });

      if (data && data.length) {
        const updatedAlerts = produce(alerts, (draft) => {
          draft.push(data[0]);
        });
        dispatch(
          updateOneMultilegState({
            attributeName: "alerts",
            attributeValue: updatedAlerts,
          }),
        );
      }
    }
    setPointerWhileAwaiting({
      lockMode: "destravar",
      id: "conditionalMultileg",
    });
  };
};

export const createMultilegPositionAction = (
  tabIndex: number,
): MainThunkAction => {
  return async (dispatch, getState) => {
    const {
      multilegReducer: { multileg },
      systemReducer: { selectedAccount },
    } = getState();

    const mountOrderProps = {
      multilegTabs: multileg,
      selectedAccount: selectedAccount,
      tabIndex,
    };

    const multilegRequestData = mountMultilegOrder(mountOrderProps);

    setPointerWhileAwaiting({ lockMode: "travar", id: "conditionalMultileg" });
    if (validateMultilegOrder(mountOrderProps))
      await criarPosicaoMultilegAPI(multilegRequestData);
    setPointerWhileAwaiting({
      lockMode: "destravar",
      id: "conditionalMultileg",
    });
  };
};

export const addQuoteBoxFromMultilegAction = (
  tabIndex: number,
): MainThunkAction => {
  return async (dispatch, getState) => {
    const {
      multilegReducer: { multileg },
      systemReducer: { selectedAccount, selectedTab },
    } = getState();

    const tabName = multileg[tabIndex].nomeAba;

    const configData = { tabKey: selectedTab };

    const mountOrderProps = {
      multilegTabs: multileg,
      selectedAccount: selectedAccount,
      tabIndex,
      comment: JSON.stringify(configData),
    };

    const multilegRequestData = mountMultilegOrder(mountOrderProps);

    setPointerWhileAwaiting({ lockMode: "travar", id: "conditionalMultileg" });

    if (validateMultilegOrder(mountOrderProps)) {
      const data = await addBoxStructureAPI({groupName: tabName,payload: multilegRequestData});

      if (data) {
        // TODO: adicionar novo box pela multileg
        // dispatch(addBoxFromAPIAction(data));
      }
    }

    setPointerWhileAwaiting({
      lockMode: "destravar",
      id: "conditionalMultileg",
    });
  };
};

export const startReactiveMultilegUpdateAction = (): MainThunkAction => {
  return (dispatch, getState) => {
    const {
      systemReducer: { token },
      multilegReducer: {
        cotacoesMultileg: multilegQuotes,
        esource_multilegQuotes,
        interval_multilegQuotes,
      },
    } = getState();

    if (esource_multilegQuotes) {
      esource_multilegQuotes.close();
    }
    if (interval_multilegQuotes) {
      clearInterval(interval_multilegQuotes);
    }

    const symbolsArray: string[] = [];
    multilegQuotes.forEach((quote) => {
      if (!symbolsArray.includes(quote.codigo)) symbolsArray.push(quote.codigo);
    });

    const symbols = symbolsArray.join(",");

    if (symbols) {
      const newSource = atualizarCotacaoMultilegAPI({
        dispatch,
        codigos: symbols,
        arrayCotacoes: multilegQuotes,
        token,
      });

      dispatch(updateMultilegStateAction("esource_multilegQuotes", newSource));
    }
  };
};

export const startProactiveMultilegUpdateAction = (): MainThunkAction => {
  return (dispatch, getState) => {
    const {
      multilegReducer: {
        cotacoesMultileg: multilegQuotes,
        esource_multilegQuotes,
        interval_multilegQuotes,
      },
      systemReducer: { updateInterval },
    } = getState();

    if (esource_multilegQuotes) {
      esource_multilegQuotes.close();
    }

    if (interval_multilegQuotes) {
      clearInterval(interval_multilegQuotes);
    }

    const symbolsArray: string[] = [];
    multilegQuotes.forEach((quote) => {
      if (!symbolsArray.includes(quote.codigo)) symbolsArray.push(quote.codigo);
    });

    const symbols = symbolsArray.join(",");

    if (symbols) {
      const interval = setInterval(async () => {
        const data = await getProactiveMultilegQuotesAPI(symbols);

        const updatedQuotes = produce(multilegQuotes, (draft) => {
          draft.forEach((quoteToUpdateItem) => {
            const updatedQuote = data.find(
              (updatedItem) => updatedItem.codigo === quoteToUpdateItem.codigo,
            );

            if (updatedQuote) {
              quoteToUpdateItem.valor = updatedQuote.valor;
              quoteToUpdateItem.compra = updatedQuote.compra;
              quoteToUpdateItem.venda = updatedQuote.venda;
            }
          });
        });

        dispatch(
          updateOneMultilegState({
            attributeName: "cotacoesMultileg",
            attributeValue: updatedQuotes,
          }),
        );
      }, updateInterval);

      dispatch(
        updateOneMultilegState({
          attributeName: "interval_multilegQuotes",
          attributeValue: interval,
        }),
      );
    }
  };
};

export const getMultilegExecStrategiesAPIAction = (): MainThunkAction => {
  return async (dispatch) => {
    const executionStrategies = await getMultilegExecStrategiesAPI();

    dispatch(
      updateOneMultilegState({
        attributeName: "executionStrategies",
        attributeValue: executionStrategies,
      }),
    );
  };
};
