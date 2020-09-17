export interface Token {
  tokenType: string;
  accessToken: string;
}

export interface Account {
  sigla: string;
  gateway: string | null;
  saldo: number | null;
  numero: string;
  nome: string;
  preferencia: string | null;
  corretora: string;
  id: number;
}

export interface BoxVisibility {
  boxKey: string;
  visibility: boolean;
}
