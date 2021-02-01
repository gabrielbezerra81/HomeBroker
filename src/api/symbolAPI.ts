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

interface SymbolData {
  symbol: string;
  ultimo: number;
  compra: number;
  compraQtde: number;
  venda: number;
  vendaQtde: number;
}

export const getSymbolsDataAPI = async (symbols: string) => {
  return api
    .get<SymbolData[]>(`price/quotes/symbols?symbols=${symbols}`)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.log("symbols batch call error", error);

      return [] as SymbolData[];
    });
};
