import { pesquisarAtivoMultilegAPI } from "api/API";
import { BoxStockOption, MultiBoxData } from "types/multiBox/MultiBoxState";
import { MainThunkAction } from "types/ThunkActions";
import { findClosestStrike } from "../multileg/utils";
import { updateBoxAttrAction } from "./multiBoxActions";

export const handleSearchBoxSymbolAction = (
  id: string,
  symbol: string,
): MainThunkAction => {
  return async (dispatch, getState) => {
    const {
      multiBoxReducer: {},
    } = getState();

    const data = await pesquisarAtivoMultilegAPI(symbol);

    if (data) {
      const payload: Partial<MultiBoxData> = {
        expirations: data.vencimentos,
        searchedSymbol: symbol,
        selectedExpiration: data.vencimentos[0],
        stockOptions: [],
        selectedStrike: 0,
      };

      payload.stockOptions = data.opcoes.sort(
        (a: BoxStockOption, b: BoxStockOption) => a.strike - b.strike,
      );

      const symbolIsOption = symbol !== data.ativoPrincipal ? true : false;

      payload.selectedStrike = findClosestStrike({
        options: data.opcoes,
        symbolQuote: data.cotacaoAtual,
        symbol,
        symbolIsOption,
      });

      dispatch(updateBoxAttrAction(id, payload));
    }
  };
};
