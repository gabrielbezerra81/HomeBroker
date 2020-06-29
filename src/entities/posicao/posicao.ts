export interface IItemPosicao {
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

export default class ItemPosicao implements IItemPosicao {
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
    assign(this, posicao);
  }
}

export function assign(target: any, source: any, typecheck = true) {
  const temp: { [k: string]: any } = {};
  for (const key of Object.keys(source)) {
    if (typecheck) {
      const sameType = typeof source[key] === typeof target[key];
      if (sameType && source[key]) temp[key] = source[key];
    } //
    else if (source[key]) temp[key] = source[key];
  }

  Object.assign(target, temp);
}
