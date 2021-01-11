export interface BoxProps {
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

type BoxKeys = keyof Omit<BoxProps, "codes" | "book">;

export type FormattedBox = Record<BoxKeys, string> &
  Pick<BoxProps, "codes" | "book">;
