interface Stock {
  id: number;
  symbol: string;
  strike: number;
  formattedStrike: string;
  market: string;
  type: "CALL" | "PUT";
  model: "AMERICAN" | "EUROPEAN";
  referenceStock: number;
  endBusiness: string;
  strikeGroup: number;
}

export interface TableLine {
  strike: number;
  formattedStrike: string;
  [key: string]: any;
}

export interface OptionTableItem {
  strikeLine: number;
  stocks: Array<Stock>;
  structuresIds: Array<number>;
}

export default interface OptionsMatrixState {
  options: Array<OptionTableItem>;
  checkedSymbols: Array<string>;
  symbolsToUpdate: Array<string>;
  stockSymbolId: number | null;
  checkIntersection: boolean;
  checkedColumns: Array<string>;
  checkedLines: Array<number>;
  strikeView: "code" | "strike";
  toggleConfig: boolean;
  type: "CALL" | "PUT";
}
