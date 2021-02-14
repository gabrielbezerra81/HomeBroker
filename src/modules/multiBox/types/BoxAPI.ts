export interface PositionCreateRequestData {
  id?: number;
  account: number;
  groupPositions: number;
  structure: number;
  stock: {
    id: number;
  };
  symbol: string;
  qtty: number;
  price: number;
}

export interface AlertCreateRequestData {
  price: number;
  param: "Bid" | "Ask" | "Last";
  operator: "Less" | "Greater";
  status: "Enabled";
  structure: {
    id: number;
  };
  expiration: string;
}
