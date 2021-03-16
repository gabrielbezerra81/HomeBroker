import api from "api/apiConfig";
import { getOneSymbolDataAPI, getSymbolInfoAPI } from "api/symbolAPI";
import {
  url_listSymbolConfig_symbol,
  url_optionsMatrix_symbol_type,
  url_saveSymbolConfig_stockId,
} from "api/url";
import { UPDATE_STATE_OPTIONS_MATRIX } from "constants/MenuActionTypes";
import produce from "immer";
import OptionsMatrixState, {
  OptionTableItem,
  TableLine,
} from "modules/optionsMatrix/types/OptionsMatrixState";
import { toast } from "react-toastify";
import { MainThunkAction } from "types/ThunkActions";
import { getSymbolByType } from "./utils";

export const updateOptionsMatrixStateAction = (
  payload: Partial<OptionsMatrixState>,
): MainThunkAction => {
  return (dispatch) => {
    dispatch({
      type: UPDATE_STATE_OPTIONS_MATRIX,
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
        `${url_optionsMatrix_symbol_type}${symbol}/CALL`,
      );

      const data = await getOneSymbolDataAPI(symbol);

      const savedSymbolsResponse = await api.get<GetSavedSymbolsAPI[]>(
        `${url_listSymbolConfig_symbol}${symbol}`,
      );

      const symbolsToUpdate = savedSymbolsResponse.data.map(
        (item) => item.symbol,
      );

      dispatch(
        updateOptionsMatrixStateAction({
          options: optionsResponse.data.lines,
          stockSymbolId: stockId,
          symbolsToUpdate,
          checkedSymbols: symbolsToUpdate,
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
      optionsMatrixReducer: {
        checkedLines,
        checkIntersection,
        checkedSymbols,
        checkedColumns,
        options,
        type,
      },
    } = getState();

    const isChecking = !checkedLines.includes(tableLine.strike);

    const isAnyColumnChecked = checkedColumns.length > 0;

    const linesToChange: number[] = [tableLine.strike];
    const columnsToChange: string[] = [];
    const symbolsToRemove: string[] = [];
    const symbolsToCheck: string[] = [];

    const { strike } = tableLine;

    options.forEach((option) => {
      option.stocks.forEach((stock) => {
        const { strikeLine } = option;

        const symbol = getSymbolByType({ type, symbol: stock.symbol });

        const [stockDate] = stock.endBusiness.split(" ");

        const alreadyAddedSymbol = checkedSymbols.includes(symbol);
        const isInSameLine = strikeLine === strike;

        if (isChecking) {
          if (
            !alreadyAddedSymbol &&
            isInSameLine &&
            (!checkIntersection || !isAnyColumnChecked)
          ) {
            symbolsToCheck.push(symbol);
            return;
          }

          if (checkIntersection) {
            const isColumnChecked = checkedColumns.includes(stockDate);

            if (isColumnChecked && isInSameLine) {
              columnsToChange.push(stockDate);

              if (!alreadyAddedSymbol) {
                symbolsToCheck.push(symbol);
              }
            } //
            else if (isAnyColumnChecked && alreadyAddedSymbol) {
              symbolsToRemove.push(symbol);
            }
          }
        } //
        else if (isInSameLine && alreadyAddedSymbol) {
          symbolsToCheck.push(symbol);
        }
      });
    });

    const updatedLines = handleCheckedListChange({
      list: checkedLines,
      changes: linesToChange,
    });
    const updatedColumns = handleCheckedListChange({
      list: checkedColumns,
      changes: columnsToChange,
    });

    const removedSymbols = handleCheckedListChange({
      list: checkedSymbols,
      changes: symbolsToRemove,
    });

    const updatedSymbols = handleCheckedListChange({
      list: removedSymbols,
      changes: symbolsToCheck,
    });

    dispatch(
      updateOptionsMatrixStateAction({
        checkedLines: updatedLines,
        checkedColumns: updatedColumns,
        checkedSymbols: updatedSymbols,
      }),
    );
  };
};

export const handleColumnHeaderSelectionAction = (
  expiration: string,
): MainThunkAction => {
  return (dispatch, getState) => {
    const {
      optionsMatrixReducer: {
        checkedSymbols,
        options,
        checkIntersection,
        checkedLines,
        checkedColumns,
        type,
      },
    } = getState();

    const linesToChange: number[] = [];
    const columnsToChange: string[] = [expiration];
    const symbolsToRemove: string[] = [];
    const symbolsToCheck: string[] = [];

    const isChecking = !checkedColumns.includes(expiration);

    const isAnyStrikeChecked = checkedLines.length > 0;

    options.forEach((option) => {
      option.stocks.forEach((stock) => {
        const [stockDate] = stock.endBusiness.split(" ");

        const symbol = getSymbolByType({ type, symbol: stock.symbol });

        const alreadyAddedSymbol = checkedSymbols.includes(symbol);
        const isInSameColumn = expiration === stockDate;

        // Está marcando a coluna
        if (isChecking) {
          // Marcando com intersecção desativada ou sem linhas marcadas
          if (
            !alreadyAddedSymbol &&
            isInSameColumn &&
            (!checkIntersection || !isAnyStrikeChecked)
          ) {
            symbolsToCheck.push(symbol);
            return;
          }

          // Marcando com intersecção ativada
          if (checkIntersection) {
            const { strikeLine } = option;
            const isStrikeChecked = checkedLines.includes(strikeLine);

            // Para marcar um código, é necessário sua linha estar marcada e restringir a marcação apenas à coluna atual
            if (isStrikeChecked && isInSameColumn) {
              linesToChange.push(strikeLine);

              if (!alreadyAddedSymbol) {
                symbolsToCheck.push(symbol);
              } //
            } // Ao marcar intersecção, alguns códigos serão removidos das linhas e colunas. Só há remoção se houver intersecção e por isso checa se tem algum
            // strike marcado
            else if (isAnyStrikeChecked && alreadyAddedSymbol) {
              symbolsToRemove.push(symbol);
            }
          }
        } // Está desmarcando os códigos que correspondem a coluna atual
        else if (isInSameColumn && alreadyAddedSymbol) {
          symbolsToCheck.push(symbol);
        }
      });
    });

    const updatedLines = handleCheckedListChange({
      list: checkedLines,
      changes: linesToChange,
    });
    const updatedColumns = handleCheckedListChange({
      list: checkedColumns,
      changes: columnsToChange,
    });

    const removedSymbols = handleCheckedListChange({
      list: checkedSymbols,
      changes: symbolsToRemove,
    });

    const updatedSymbols = handleCheckedListChange({
      list: removedSymbols,
      changes: symbolsToCheck,
    });

    dispatch(
      updateOptionsMatrixStateAction({
        checkedLines: updatedLines,
        checkedColumns: updatedColumns,
        checkedSymbols: updatedSymbols,
      }),
    );
  };
};

export const handleSymbolSelectionAction = (
  itemsToCheck: string[],
): MainThunkAction => {
  return (dispatch, getState) => {
    const {
      optionsMatrixReducer: { checkedSymbols },
    } = getState();

    const updatedSymbols = handleCheckedListChange({
      list: checkedSymbols,
      changes: itemsToCheck,
    });

    dispatch(
      updateOptionsMatrixStateAction({ checkedSymbols: updatedSymbols }),
    );
  };
};

export const handleSaveSelectionsAction = (): MainThunkAction => {
  return async (dispatch, getState) => {
    const {
      optionsMatrixReducer: {
        checkedSymbols,
        symbolsToUpdate,
        stockSymbolId,
        options,
        type,
      },
    } = getState();

    const updatedSymbols = produce(symbolsToUpdate, (draft) => {
      draft.splice(0);

      draft.push(...checkedSymbols);
    });

    try {
      const symbolsIds: number[] = [];

      options.forEach((option) => {
        option.stocks.forEach((stock) => {
          const symbol = getSymbolByType({ type, symbol: stock.symbol });

          if (updatedSymbols.includes(symbol)) {
            symbolsIds.push(stock.id);
          }
        });
      });

      await api.put(
        `${url_saveSymbolConfig_stockId}${stockSymbolId}`,
        symbolsIds,
      );

      setTimeout(() => {
        toast.success("Configurações salvas!");
      }, 50);
    } catch (error) {
      setTimeout(() => {
        toast.error("Erro ao salvar configurações");
      }, 50);
    }

    dispatch(
      updateOptionsMatrixStateAction({
        symbolsToUpdate: updatedSymbols,
        toggleConfig: false,
      }),
    );
  };
};

interface HandleCheckedArrayChange {
  list: any[];
  changes: any[];
}

const handleCheckedListChange = ({
  list,
  changes,
}: HandleCheckedArrayChange) => {
  const updatedList = produce(list, (draft) => {
    const indexesToRemove: number[] = [];

    changes.forEach((itemsToChange) => {
      const index = draft.findIndex(
        (checkedItem) => checkedItem === itemsToChange,
      );

      if (index === -1) {
        draft.push(itemsToChange);
      } //
      else {
        indexesToRemove.push(index);
      }
    });

    if (indexesToRemove.length) {
      return draft.filter((_, index) => !indexesToRemove.includes(index));
    }
  });

  return updatedList;
};

// Seleção de coluna antiga
/*

export const handleColumnHeaderSelectionAction = (
  expiration: string,
): MainThunkAction => {
  return (dispatch, getState) => {
    const {
      optionsMatrixReducer: { checkedItems, options },
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
      optionsMatrixReducer: { checkedItems },
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
