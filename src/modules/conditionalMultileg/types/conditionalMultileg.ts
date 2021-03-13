export interface ConditionalMultilegTab {
  nomeAba: string;
  ativo: string;
  ativoAtual: string;
  market: string;
  variacao: number;
  opcoes: Array<ConditionalMultilegOption>;
  codigoAberto: boolean;
  strikeSelecionado: number | undefined;
  vencimento: Array<string>;
  vencimentoSelecionado: string;
  preco: string;
  validadeSelect: "DAY" | "SPECIFIED_DAY" | "GTC";
  date: Date;
  tabelaMultileg: Array<ConditionalMultilegOffer>;
  isAlertOpen: boolean;
  param: "Bid" | "Ask" | "Last";
  operator: "Less" | "Greater";
  comment: string;
  selectedStrategy: number;
  editingOrderId: number | null;
  // diferenças para multileg
  tabType: "CONDIÇÃO" | "ORDEM";
}

export interface ConditionalMultilegOption {
  id: number;
  symbol: string;
  expiration: string;
  strike: number;
  model: "EUROPEAN" | "AMERICAN";
  type: "PUT" | "CALL";
}

export interface ConditionalMultilegQuote {
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

export interface ConditionalMultilegOffer {
  opcoes: Array<ConditionalMultilegOption> | Array<{ symbol: string }>;
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

export interface ExecutionStrategy {
  id: number;
  boleta: string;
  name: string;
  sigla: string;
  trigger: number | null;
}
