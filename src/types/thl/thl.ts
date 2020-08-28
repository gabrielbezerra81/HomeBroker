export interface DueDatesTableItem {
  strikeLine: number;
  structureIds: Array<number>;
  stocks: Array<
    Stock & {
      vencimento: string;
    }
  >;
}

export interface THLBook {
  ativo: string;
  tipo: "compra" | "venda";
}

export interface PriceStructure {
  id: number;
  name: string;
  components: Array<StructureComponent>;
  max: number;
  min: number;
  last: number;
  enabled: boolean;
  expiration: string;
  created: string;
}

export interface StructureComponent {
  id: number;
  stock: {
    id: number;
    symbol: string;
    market: string;
    strike: number;
    type: "CALL" | "PUT";
    model: "AMERICAN" | "EUROPEAN";
    endBusiness: string;
    option: boolean;
  };
  qtty: number;
  compraQtde: number;
  compra: number;
  vendaQtde: number;
  venda: number;
}

export interface CombinationsTableItem {
  id: number;
  estrategia: string;
  grupo: string;
  acaoUlt: {
    acao: string;
  };
  spread: number;
  estrutura: {
    id: number;
    name: string;
    symbol: string;
    components: Array<{
      id: number;
      stock: Stock;
      qtty: number;
      compraQtde: number | null;
      compra: number | null;
      vendaQtde: number | null;
      venda: number | null;
    }>;
    max: number;
    min: number;
    last: number;
    expiration: string;
    prazo: number;
    lastUpdate: string;
  };
  codigos: {
    opcao1: Stock;
    opcao2: Stock;
  };
  montagem: number;
  desmontagem: number;
  vencimento: string;
  prazo: number;
}

export type FilterOperation = "=" | "<" | ">" | "<>" | "><";

export interface THLQuote {
  codigo: string;
  cotacao: number | "";
}

export interface Stock {
  id: number;
  symbol: string;
  market: string;
  strike: number;
  type: "CALL" | "PUT";
  model: "AMERICAN" | "EUROPEAN";
  referenceStock: number;
  startBusiness: string;
  endBusiness: string;
  option: boolean;
}
