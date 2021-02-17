export interface CategoryLine {
  id?: number;
  symbol: string;
  price: number;
  oscilation: number;
  yearOscilation: number;
  [key: string]: any;
}

export interface CategoryLineSymbolData {
  symbol: string;
  price: number;
  oscilation: number;
  yearOscilation: number;
}

export interface Category {
  title: string;
  lines: Array<CategoryLine>;
}

export interface CategoryListState {
  categories: Array<Category>;
  symbolsData: Array<CategoryLineSymbolData>;
}
