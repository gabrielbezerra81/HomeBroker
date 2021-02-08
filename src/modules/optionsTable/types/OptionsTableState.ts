interface Stock {
  symbol: string;
  strike: number;
  market: string;
  type: "CALL" | "PUT";
  model: "AMERICAN" | "EUROPEAN";
  referenceStock: number;
  endBusiness: string;
  strikeGroup: number;
}

export interface OptionTableItem {
  strikeLine: number;
  stocks: Array<Stock>;
  structuresIds: Array<number>;
}

export default interface OptionsTableState {
  symbol: string;
  type: "CALL" | "PUT";
  options: Array<OptionTableItem>;
}
