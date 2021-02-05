export interface Token {
  tokenType: string;
  accessToken: string;
}

export interface AuthData {
  token_type: string;
  access_token: string;
  expires_in: number;
  id_token: string;
  refresh_expires_in: number;
  refresh_token: string;
  session_state: string;
  token_date: number;
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
