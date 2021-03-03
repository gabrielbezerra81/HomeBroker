import api from "api/apiConfig";
import { getOneSymbolDataAPI } from "api/symbolAPI";
import { url_optionsTable_symbol_type } from "api/url";
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

export const handleSearchOptionsAction = ({
  symbol,
  type,
}: SearchProps): MainThunkAction => {
  return async (dispatch) => {
    try {
      if (!symbol) {
        return null;
      }

      const response = await api.get<GetOptionsAPI>(
        `${url_optionsTable_symbol_type}${symbol}/${type}`,
      );

      const data = await getOneSymbolDataAPI(symbol);

      dispatch(updateOptionsTableStateAction({ options: response.data.lines }));

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
  return (dispatch, getState) => {
    const {
      optionsTableReducer: { checkedItems, symbolsToUpdate },
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

    setTimeout(() => {
      alert("Configurações salvas!");
    }, 50);

    dispatch(
      updateOptionsTableStateAction({ symbolsToUpdate: updatedSymbols }),
    );
  };
};
