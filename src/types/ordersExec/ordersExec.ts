// TODO: type reducer

export interface Order {
  id: number;
  offers: Array<any>;
  nextOrders: Array<any>;
  cadastro: any;
  corretora: any;
  conta: any;
  operacao: any;
  formName: string;
  validade: string;
  roteador: string;
}

export interface OrderExecOpenPopupData {
  dadosPesquisa: any; // TODO:
  ativo: string;
  qtde: number | string; // TODO:
  entradaDisparo: number | string; // TODO:
  entradaExec: number | string; // TODO:
  preco: string;

  inicioDisparo: string;
  gainDisparo: string;
  gainExec: string;
  stopDisparo: string;
  stopExec: string;
  ajustePadrao: string;
  tabelaOrdens: Array<any>;
}
