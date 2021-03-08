import api from "api/apiConfig";
import { getOneSymbolDataAPI, getSymbolInfoAPI } from "api/symbolAPI";
import {
  url_listSymbolConfig_symbol,
  url_optionsTable_symbol_type,
  url_saveSymbolConfig_stockId,
} from "api/url";
import { UPDATE_STATE_OPTIONS_TABLE } from "constants/MenuActionTypes";
import produce from "immer";
import OptionsTableState, {
  OptionTableItem,
  TableLine,
} from "modules/optionsTable/types/OptionsTableState";
import { MainThunkAction } from "types/ThunkActions";

export const updateOptionsTableStateAction = (
  payload: Partial<OptionsTableState>,
): MainThunkAction => {
  return (dispatch) => {
    dispatch({
      type: UPDATE_STATE_OPTIONS_TABLE,
      payload,
    });
  };
};

// interface LineSelectionProps {
//   tableLine: TableLine;
//   selectMode: "strikeOnly" | "strikeAndSymbols";
// }

interface SearchProps {
  symbol: string;
  type: "CALL" | "PUT";
}

interface GetOptionsAPI {
  lines: Array<OptionTableItem>;
}

interface GetSavedSymbolsAPI {
  symbol: string;
  id: string;
}

export const handleSearchOptionsAction = ({
  symbol,
  type,
}: SearchProps): MainThunkAction => {
  return async (dispatch) => {
    try {
      if (!symbol) {
        return null;
      }

      const symbolInfo = await getSymbolInfoAPI(symbol);
      let stockId: number | null = null;

      if (symbolInfo) {
        stockId =
          symbolInfo.option && symbolInfo.referenceStock
            ? symbolInfo.referenceStock
            : symbolInfo.id;
      }

      const optionsResponse = await api.get<GetOptionsAPI>(
        `${url_optionsTable_symbol_type}${symbol}/${type}`,
      );

      const data = await getOneSymbolDataAPI(symbol);

      const savedSymbolsResponse = await api.get<GetSavedSymbolsAPI[]>(
        `${url_listSymbolConfig_symbol}${symbol}`,
      );

      const symbolsToUpdate = savedSymbolsResponse.data.map(
        (item) => item.symbol,
      );

      dispatch(
        updateOptionsTableStateAction({
          options: optionsResponse.data.lines,
          stockSymbolId: stockId,
          symbolsToUpdate,
          checkedItems: symbolsToUpdate,
        }),
      );

      if (data) {
        return {
          last: data.ultimo || 0,
          oscilation: data.oscilacao || 0,
        };
      }
    } catch (error) {}

    return null;
  };
};

export const handleLineSelectionAction = (
  tableLine: TableLine,
): MainThunkAction => {
  return (dispatch, getState) => {
    const {
      optionsTableReducer: { checkedItems },
    } = getState();

    const isChecking = !checkedItems.includes(tableLine.strike.toString());

    const itemsToCheck: string[] = [tableLine.strike.toString()];

    const { strike, ...rest } = tableLine;
    const lineData = { ...rest }; // contém pares expiration:symbol

    Object.keys(lineData).forEach((expirationKey) => {
      // Se a coluna estiver marcada, então é preciso adicionar o código aos marcados ou removê-los

      const { symbol } = lineData[expirationKey];

      const alreadyAddedSymbol = checkedItems.includes(symbol);

      if (isChecking) {
        // Se estiver marcando, precisa garantir que o código não está marcado, pois se der o push e mandar um já marcado, ele vai ser desmarcado
        if (!alreadyAddedSymbol) {
          itemsToCheck.push(symbol);
        }
      } // Para desmarcar, precisa garantir que estava marcado
      else if (alreadyAddedSymbol) {
        itemsToCheck.push(symbol);
      }
    });

    dispatch(handleSymbolSelectionAction(itemsToCheck));
  };
};

export const handleColumnHeaderSelectionAction = (
  expiration: string,
): MainThunkAction => {
  return (dispatch, getState) => {
    const {
      optionsTableReducer: { checkedItems, options },
    } = getState();

    const itemsToCheck: string[] = [expiration];

    const isChecking = !checkedItems.includes(expiration);

    options.forEach((option) => {
      option.stocks.forEach((stock) => {
        const [date] = stock.endBusiness.split(" ");

        if (date === expiration) {
          const alreadyAddedSymbol = checkedItems.includes(stock.symbol);

          if (isChecking) {
            if (!alreadyAddedSymbol) {
              itemsToCheck.push(stock.symbol);
            }
          } //
          else if (alreadyAddedSymbol) {
            itemsToCheck.push(stock.symbol);
          }
        }
      });
    });

    dispatch(handleSymbolSelectionAction(itemsToCheck));
  };
};

export const handleSymbolSelectionAction = (
  itemsToCheck: string[],
): MainThunkAction => {
  return (dispatch, getState) => {
    const {
      optionsTableReducer: { checkedItems },
    } = getState();

    const updatedSymbols = produce(checkedItems, (draft) => {
      const indexesToRemove: number[] = [];

      itemsToCheck.forEach((itemToCheck) => {
        const index = draft.findIndex(
          (checkedItem) => checkedItem === itemToCheck,
        );

        if (index === -1) {
          draft.push(itemToCheck);
        } //
        else {
          indexesToRemove.push(index);
        }
      });

      if (indexesToRemove.length) {
        return draft.filter((_, index) => !indexesToRemove.includes(index));
      }
    });

    dispatch(updateOptionsTableStateAction({ checkedItems: updatedSymbols }));
  };
};

export const handlSaveSelectionsAction = (): MainThunkAction => {
  return async (dispatch, getState) => {
    const {
      optionsTableReducer: {
        checkedItems,
        symbolsToUpdate,
        stockSymbolId,
        options,
      },
    } = getState();

    const updatedSymbols = produce(symbolsToUpdate, (draft) => {
      const symbolsArray = checkedItems.filter((item) => {
        // Pode ser símbolo, strike ou expiration

        const isSymbol = Number.isNaN(Number(item));
        const isExpiration = item.includes("/");

        return isSymbol && !isExpiration;
      });

      draft.splice(0);

      draft.push(...symbolsArray);
    });

    try {
      const symbolsIds: number[] = [];

      options.forEach((option) => {
        option.stocks.forEach((stock) => {
          if (updatedSymbols.includes(stock.symbol)) {
            symbolsIds.push(stock.id);
          }
        });
      });

      await api.put(
        `${url_saveSymbolConfig_stockId}${stockSymbolId}`,
        symbolsIds,
      );

      setTimeout(() => {
        alert("Configurações salvas!");
      }, 50);
    } catch (error) {
      setTimeout(() => {
        alert("Erro ao salvar configurações");
      }, 50);
    }

    dispatch(
      updateOptionsTableStateAction({ symbolsToUpdate: updatedSymbols }),
    );
  };
};

// Seleção de coluna antiga
/*

export const handleColumnHeaderSelectionAction = (
  expiration: string,
): MainThunkAction => {
  return (dispatch, getState) => {
    const {
      optionsTableReducer: { checkedItems, options },
    } = getState();

    const itemsToCheck: string[] = [expiration];

    const isChecking = !checkedItems.includes(expiration);

    options.forEach((option) => {
      const { strikeLine } = option;

      option.stocks.forEach((stock) => {
        const [date] = stock.endBusiness.split(" ");

        if (date === expiration) {
          const alreadyAddedSymbol = checkedItems.includes(stock.symbol);
          const isStrikeChecked = checkedItems.includes(strikeLine.toString());

          if (isChecking) {
            if (!alreadyAddedSymbol && isStrikeChecked) {
              itemsToCheck.push(stock.symbol);
            }
          } //
          else if (alreadyAddedSymbol) {
            itemsToCheck.push(stock.symbol);
          }
        }
      });
    });

    dispatch(handleSymbolSelectionAction(itemsToCheck));
  };
};

*/

// Seleção de linha antiga
/*

export const handleLineSelectionAction = (
  tableLine: TableLine,
): MainThunkAction => {
  return (dispatch, getState) => {
    const {
      optionsTableReducer: { checkedItems },
    } = getState();

    const isChecking = !checkedItems.includes(tableLine.strike.toString());

    const itemsToCheck: string[] = [tableLine.strike.toString()];

    const { strike, ...rest } = tableLine;
    const lineData = { ...rest }; // contém pares expiration:symbol

    Object.keys(lineData).forEach((expirationKey) => {
      // Se a coluna estiver marcada, então é preciso adicionar o código aos marcados ou removê-los

      const symbol = lineData[expirationKey];

      const alreadyAddedSymbol = checkedItems.includes(symbol);

      if (isChecking) {
        // Se estiver marcando, precisa garantir que o código não está marcado, pois se der o push e mandar um já marcado, ele vai ser desmarcado
        if (checkedItems.includes(expirationKey) && !alreadyAddedSymbol) {
          itemsToCheck.push(symbol);
        }
      } // Para desmarcar, precisa garantir que estava marcado
      else if (alreadyAddedSymbol) {
        itemsToCheck.push(symbol);
      }
    });

    dispatch(handleSymbolSelectionAction(itemsToCheck));
  };
};

 */
