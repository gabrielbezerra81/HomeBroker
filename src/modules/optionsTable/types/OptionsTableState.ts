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

export interface TableLine {
  strike: number;
  [key: string]: any;
}

export interface OptionTableItem {
  strikeLine: number;
  stocks: Array<Stock>;
  structuresIds: Array<number>;
}

export default interface OptionsTableState {
  options: Array<OptionTableItem>;
  checkedItems: Array<string>;
  symbolsToUpdate: Array<string>;
}
