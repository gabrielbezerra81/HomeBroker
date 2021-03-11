import {
  pesquisarAtivoMultilegAPI,
  enviarOrdemAPI,
  setPointerWhileAwaiting,
  criarPosicaoMultilegAPI,
  addBoxStructureAPI,
  getMultilegExecStrategiesAPI,
} from "api/API";
import {
  cond_cloneMultilegTabs,
  updateConditionalMultilegStateAction,
} from "./ConditionalMultilegActions";
import {
  cond_mountMultilegOrder,
  cond_validateMultilegOrder,
  cond_addNewMultilegQuote,
  cond_findClosestStrike,
  updateOneConditionalMultilegState,
  updateManyConditionalMultilegState,
} from "./utils";
import { MainThunkAction } from "types/ThunkActions";
import {
  ConditionalMultilegQuote,
  ConditionalMultilegTab,
  ConditionalMultilegOption,
} from "../../types/conditionalMultileg";
import produce from "immer";
import { LISTAR_ORDENS_EXECUCAO } from "constants/ApiActionTypes";
import { atualizarCotacaoMultilegAPI } from "api/reactive/ReativosAPI";
import { getProactiveMultilegQuotesAPI } from "api/proactive/ProativosAPI";

////

export const cond_searchMultilegSymbolAPIAction = (
  tabIndex: number,
): MainThunkAction => {
  return async (dispatch, getState) => {
    const {
      conditionalMultilegReducer: { multileg, cotacoesMultileg },
    } = getState();

    const data = await cond_searchMultilegSymbolData({
      multilegTabs: multileg,
      tabIndex,
      multilegQuotes: cotacoesMultileg,
    });

    dispatch(
      updateManyConditionalMultilegState({
        cotacoesMultileg: data.multilegQuotes,
        multileg: data.multilegTabs,
      }),
    );
  };
};

interface searchSymbolData {
  multilegTabs: ConditionalMultilegTab[];
  tabIndex: number;
  multilegQuotes: ConditionalMultilegQuote[];
}

export const cond_searchMultilegSymbolData = async ({
  multilegQuotes,
  multilegTabs,
  tabIndex,
}: searchSymbolData) => {
  let updatedMultilegTabs = cond_cloneMultilegTabs(multilegTabs);
  let multilegTab = updatedMultilegTabs[tabIndex];
  const symbol = multilegTab.ativo;

  const data = await pesquisarAtivoMultilegAPI(symbol);

  if (data) {
    cond_addNewMultilegQuote({
      multilegQuotes,
      symbol,
      quote: data.cotacaoAtual,
    });

    const symbolIsOption = symbol !== data.ativoPrincipal ? true : false;

    multilegTab.opcoes = [...data.opcoes].sort(
      (a: ConditionalMultilegOption, b: ConditionalMultilegOption) =>
        a.strike - b.strike,
    );
    multilegTab.vencimento = [...data.vencimentos];
    multilegTab.variacao = data.variacao;
    multilegTab.vencimentoSelecionado = multilegTab.opcoes[0].expiration;
    multilegTab.strikeSelecionado = cond_findClosestStrike({
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

export const cond_sendMultilegOrderAction = (
  tabIndex: number,
): MainThunkAction => {
  return async (dispatch, getState) => {
    const {
      conditionalMultilegReducer: { multileg },
      systemReducer: { selectedAccount },
      ordersExecReducer: { tabelaOrdensExecucao },
    } = getState();

    const mountOrderProps = {
      multilegTabs: multileg,
      selectedAccount: selectedAccount,
      tabIndex,
    };

    const multilegRequestData = cond_mountMultilegOrder(mountOrderProps);

    setPointerWhileAwaiting({
      lockMode: "travar",
      id: "conditionalMultileg",
      parentID: "body",
    });

    if (cond_validateMultilegOrder(mountOrderProps)) {
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

// export const createMultilegAlertAction = (
//   tabIndex: number,
// ): MainThunkAction => {
//   return async (dispatch, getState) => {
//     const {
//       conditionalMultilegReducer: { multileg, alerts },
//       systemReducer: { selectedAccount },
//     } = getState();

//     const { param, operator, comment } = multileg[tabIndex];

//     const mountOrderProps = {
//       multilegTabs: multileg,
//       selectedAccount: selectedAccount,
//       tabIndex,
//       comment,
//     };

//     const multilegRequestData = cond_mountMultilegOrder(mountOrderProps);

//     setPointerWhileAwaiting({ lockMode: "travar", id: "conditionalMultileg" });
//     if (cond_validateMultilegOrder(mountOrderProps)) {
//       const data = await criarAlertaOperacaoAPI({
//         param,
//         operator,
//         data: multilegRequestData,
//       });

//       if (data && data.length) {
//         const updatedAlerts = produce(alerts, (draft) => {
//           draft.push(data[0]);
//         });
//         dispatch(
//           updateOneConditionalMultilegState({
//             attributeName: "alerts",
//             attributeValue: updatedAlerts,
//           }),
//         );
//       }
//     }
//     setPointerWhileAwaiting({
//       lockMode: "destravar",
//       id: "conditionalMultileg",
//     });
//   };
// };

export const cond_createMultilegPositionAction = (
  tabIndex: number,
): MainThunkAction => {
  return async (dispatch, getState) => {
    const {
      conditionalMultilegReducer: { multileg },
      systemReducer: { selectedAccount },
    } = getState();

    const mountOrderProps = {
      multilegTabs: multileg,
      selectedAccount: selectedAccount,
      tabIndex,
    };

    const multilegRequestData = cond_mountMultilegOrder(mountOrderProps);

    setPointerWhileAwaiting({ lockMode: "travar", id: "conditionalMultileg" });
    if (cond_validateMultilegOrder(mountOrderProps))
      await criarPosicaoMultilegAPI(multilegRequestData);
    setPointerWhileAwaiting({
      lockMode: "destravar",
      id: "conditionalMultileg",
    });
  };
};

export const cond_addQuoteBoxFromMultilegAction = (
  tabIndex: number,
): MainThunkAction => {
  return async (dispatch, getState) => {
    const {
      conditionalMultilegReducer: { multileg },
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

    const multilegRequestData = cond_mountMultilegOrder(mountOrderProps);

    setPointerWhileAwaiting({ lockMode: "travar", id: "conditionalMultileg" });

    if (cond_validateMultilegOrder(mountOrderProps)) {
      const data = await addBoxStructureAPI({
        groupName: tabName,
        payload: multilegRequestData,
      });

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

export const cond_startReactiveMultilegUpdateAction = (): MainThunkAction => {
  return (dispatch, getState) => {
    const {
      systemReducer: { token },
      conditionalMultilegReducer: {
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

      dispatch(
        updateConditionalMultilegStateAction(
          "esource_multilegQuotes",
          newSource,
        ),
      );
    }
  };
};

export const cond_startProactiveMultilegUpdateAction = (): MainThunkAction => {
  return (dispatch, getState) => {
    const {
      conditionalMultilegReducer: {
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
          updateOneConditionalMultilegState({
            attributeName: "cotacoesMultileg",
            attributeValue: updatedQuotes,
          }),
        );
      }, updateInterval);

      dispatch(
        updateOneConditionalMultilegState({
          attributeName: "interval_multilegQuotes",
          attributeValue: interval,
        }),
      );
    }
  };
};

export const cond_getMultilegExecStrategiesAPIAction = (): MainThunkAction => {
  return async (dispatch) => {
    const executionStrategies = await getMultilegExecStrategiesAPI();

    dispatch(
      updateOneConditionalMultilegState({
        attributeName: "executionStrategies",
        attributeValue: executionStrategies,
      }),
    );
  };
};
