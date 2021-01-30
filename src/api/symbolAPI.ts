import { SymbolToolTipInfo } from "types/multiBox/MultiBoxState";
import api from "./apiConfig";
import { url_stockInfo_symbol } from "./url";

export const getSymbolInfoAPI = async (
  symbol: string,
): Promise<SymbolToolTipInfo | null> => {
  return api
    .get(`${url_stockInfo_symbol}${symbol}`)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.log(error);
      return null;
    });
};
