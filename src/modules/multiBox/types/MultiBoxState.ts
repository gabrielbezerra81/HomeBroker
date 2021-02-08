export interface Tab1Data {
  boxId: string;
  id: number;
  structureID: number;
  buy: number;
  sell: number;
  quote: number;
  min: number;
  max: number;
  book: {
    buy: Array<{ qtty: number; price: number; [key: string]: any }>;
    sell: Array<{ qtty: number; price: number; [key: string]: any }>;
  };
  dayOscilation: number;
  codes: Array<Code>;
  configuration: string;
  structure: any;
}

export interface Code {
  symbol: string;
  type: "buy" | "sell";
  qtty: number;
}

type BoxKeys = keyof Omit<Tab1Data, "codes" | "book">;

export type FormattedBox = Record<BoxKeys, string> &
  Pick<Tab1Data, "codes" | "book">;

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

export interface TopSymbol {
  qtty: number;
  offerType: "C" | "V";
  viewMode: "strike" | "code";
  expiration: string;
  model: "EUROPEAN" | "AMERICAN";
  strike: number | string;
  code: string;
  type: "CALL" | "PUT";
}

export interface SymbolToolTipInfo {
  corporationName?: string;
  market: string;
  symbol: string;
  specificationCode?: string;
  type?: "CALL" | "PUT";
  model?: "EUROPEAN" | "AMERICAN";
  strike: number;
  endBusiness: string;
  option: boolean;
}

export interface StockSymbolData {
  symbol: string;
  last: number;
  min: number;
  max: number;
  oscilation: number;
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
  topSymbols: Array<TopSymbol>;
  tab1Id: number;
  selectedValidity: "DAY" | "SPECIFIED_DAY" | "GTC";
  selectedDate: Date;
  condition: "Less" | "Greater";
  observation: string;
  consideredPrice: "Bid" | "Ask" | "Last";
  price: number;
  loadingAPI: boolean;
  stockSymbolData: StockSymbolData | null;
}

type Tab1Keys = keyof Omit<Tab1Data, "codes" | "book">;

export type FormattedTab1Data = Record<Tab1Keys, string> &
  Pick<Tab1Data, "codes" | "book">;

export type SingleBook = {
  buy: {
    qtty: number;
    price: number;
    [key: string]: any;
  };
  sell: {
    qtty: number;
    price: number;
    [key: string]: any;
  };
};

export type FormattedSingleBook = {
  buy: {
    qtty: number;
    price: number;
    formattedQtty: string;
    formattedPrice: string;
  };
  sell: {
    qtty: number;
    price: number;
    formattedQtty: string;
    formattedPrice: string;
  };
} | null;

export default interface MultiBoxState {
  boxes: Array<MultiBoxData>;
  boxesTab1Data: Array<Tab1Data>;
  esource_multiBox: EventSource | null;
  interval_multiBox: NodeJS.Timeout | null;
  esource_tab4Box: EventSource | null;
  interval_tab4Box: NodeJS.Timeout | null;
}