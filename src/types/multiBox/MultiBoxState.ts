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
}

export interface MultiBoxData {
  id: string;
  activeTab: "1" | "2" | "3" | "4" | "5";
  minimized: boolean;
  symbolInput: string;
  searchedSymbol: string;
  stockOptions: Array<BoxStockOption>;
  expirations: Array<string>;
  selectedStrike: number;
  selectedExpiration: string;
  boxOffers: Array<BoxOffer>;
}

export default interface MultiBoxState {
  boxes: Array<MultiBoxData>;
  strikeViewMode: "code" | "strike";
}
