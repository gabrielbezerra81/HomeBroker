import { typedAssign } from "types/utils";

export interface PositionPrice {
  precoCompra: number;
  precoVenda: number;
  cotacaoAtual: number;
  idEstrutura: number;
}

export interface PositionQuote {
  codigo: string;
  cotacao: number;
}

export interface PositionItem {
  ativos: any[];
  precoCompra: number;
  precoVenda: number;
  cotacaoAtual: number;
  oscilacao: number;
  stopLoss: number;
  stopGain: number;
  total: number;
  variacaoGanho: number;
  qtde: number;
  preco: number;
  custodiaCompra: any[];
  custodiaVenda: any[];
  executando: any[];
  idEstrutura: number;
  agrupadorPrincipal: number;
}

export default class Position implements PositionItem {
  ativos: any[] = [];
  precoCompra: number = 0;
  precoVenda: number = 0;
  cotacaoAtual: number = 0;
  oscilacao: number = 0;
  stopLoss: number = 0;
  stopGain: number = 0;
  total: number = 0;
  variacaoGanho: number = 0;
  qtde: number = 0;
  preco: number = 0;
  custodiaCompra: any[] = [];
  custodiaVenda: any[] = [];
  executando: any[] = [];
  idEstrutura: number = 0;
  agrupadorPrincipal: number = 0;

  constructor(posicao: any) {
    typedAssign(this, posicao);
  }
}
