import { SymbolToolTipInfo } from "types/multiBox/MultiBoxState";
import api from "./apiConfig";
import { url_stockInfo_symbol } from "./url";

interface SymbolInfo extends SymbolToolTipInfo {
  referenceStock?: number;
  isOption: boolean;
  symbol: string;
}

export const getSymbolInfoAPI = async (
  symbol: string,
): Promise<SymbolInfo | null> => {
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

interface StockInfo {
  id: number;
  symbol: string;
  market: string;
  specificationCode: string;
  corporationName: string;
  strike: number;
  startBusiness: string;
  endBusiness: string;
  option: boolean;
}

export const getStockInfoAPI = async (referenceStock: number) => {
  return api
    .get<StockInfo>(`stocks/${referenceStock}`)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.log(error);

      return null;
    });
};

interface OneSymbol {
  ultimo: number;
  maximo: number;
  minimo: number;
  oscilacao: number;
}

export const getOneSymbolDataAPI = async (symbol: string) => {
  return api
    .get<OneSymbol>(`price/quotes/${symbol}`)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.log(error);
      return null;
    });
};
