export interface BoxStockOption {
  id: number;
  symbol: string;
  expiration: string;
  strike: number;
  model: "EUROPEAN" | "AMERICAN";
  type: "PUT" | "CALL";
}

export interface BoxOffer {
  offerType: "C" | "V";
  qtty: number;
  selectedStrike: number;
  selectedCode: string;
  selectedExpiration: string;
  type: "CALL" | "PUT";
  model: "AMERICAN" | "EUROPEAN";
  stockOptions: Array<BoxStockOption>;
  expirations: Array<string>;
  stockSymbol: string;
}

export interface TopSymbols {
  qtty: number;
  offerType: "C" | "V";
  viewMode: "strike" | "code";
  expiration: string;
  model: "EUROPEAN" | "AMERICAN";
  strike: number | string;
  code: string;
  type: "CALL" | "PUT";
}

export interface MultiBoxData {
  id: string;
  activeTab: "1" | "2" | "3" | "4" | "5";
  minimized: boolean;
  symbolInput: string;
  searchedSymbol: string;
  stockSymbol: string;
  stockOptions: Array<BoxStockOption>;
  expirations: Array<string>;
  selectedStrike: number;
  selectedExpiration: string;
  boxOffers: Array<BoxOffer>;
  strikeViewMode: "code" | "strike";
}

export default interface MultiBoxState {
  boxes: Array<MultiBoxData>;
}
