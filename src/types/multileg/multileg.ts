export interface MultilegTab {
  nomeAba: string;
  ativo: string;
  ativoAtual: string;
  variacao: number;
  opcoes: Array<MultilegOption>;
  codigoAberto: boolean;
  strikeSelecionado: number;
  vencimento: Array<string>;
  vencimentoSelecionado: string;
  preco: string;
  validadeSelect: "DAY" | "SPECIFIED_DAY" | "GTC";
  date: Date;
  tabelaMultileg: Array<MultilegOffer>;
}

interface MultilegOption {
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

interface MultilegOffer {
  opcoes: Array<MultilegOption | { symbol: string }>;
  strikeSelecionado: number;
  cv: "compra" | "venda";
  qtde: number;
  serie: Array<string>;
  serieSelecionada: string;
  codigoSelecionado: string;
  codigoAberto: boolean;
  tipo: "call" | "put";
  modelo: "EUROPEAN" | "AMERICAN";
  despernamento: number;
  prioridade: number;
  ativoAtual: string;
}
