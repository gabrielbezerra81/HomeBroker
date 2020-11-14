export interface MultilegTab {
  nomeAba: string;
  ativo: string;
  ativoAtual: string;
  variacao: number;
  opcoes: Array<MultilegOption>;
  codigoAberto: boolean;
  strikeSelecionado: number | undefined;
  vencimento: Array<string>;
  vencimentoSelecionado: string;
  preco: string;
  validadeSelect: "DAY" | "SPECIFIED_DAY" | "GTC";
  date: Date;
  tabelaMultileg: Array<MultilegOffer>;
  isAlertOpen: boolean;
  param: "Bid" | "Ask" | "Last";
  operator: "Less" | "Greater";
  comment: string;
  selectedStrategy: string;
}

export interface MultilegOption {
  id: number;
  symbol: string;
  expiration: string;
  strike: number;
  model: "EUROPEAN" | "AMERICAN";
  type: "PUT" | "CALL";
}

export interface MultilegQuote {
  codigo: string;
  valor: number;
  compra: {
    price: number | null;
    qtty: number | null;
    type: "C" | "V";
  };
  venda: {
    price: number | null;
    qtty: number | null;
    type: "C" | "V";
  };
}

export interface MultilegOffer {
  opcoes: Array<MultilegOption> | Array<{ symbol: string }>;
  strikeSelecionado: number;
  cv: "compra" | "venda";
  qtde: number;
  serie: Array<string>;
  serieSelecionada: string;
  codigoSelecionado: string;
  tipo: "call" | "put";
  modelo: "EUROPEAN" | "AMERICAN";
  despernamento: number;
  prioridade: number;
  ativoAtual: string;
}

export interface AlertAPI {
  id: number;
  param: "Bid" | "Ask" | "Last";
  operator: "Less" | "Greater";
  comment: string;
  expiration: string;
  price: number;
  structure: {
    id: number;
    symbol: string;
    components: Array<{
      qtty: number;
      stock: {
        symbol: string;
        option: boolean;
        type: "CALL" | "PUT" | undefined;
        model: string;
        strike: number;
      };
    }>;
  };
}

export interface ExecutionStrategy {
  id: number;
  boleta: string;
  name: string;
  sigla: string;
  trigger: number | null;
}
