export interface Order {
  id: number;
  offers: Array<OrderExecOffer>;
  nextOrders: Array<OrderExecOffer>;
  cadastro: string;
  corretora: string;
  conta: string | undefined;
  operacao: string;
  formName: string;
  validade: string;
  roteador: string;
}

export interface OrderExecOffer {
  modoExec: string;
  ativo: string;
  oferta: string;
  qtdeOferta: number;
  qtdeExecutada: number;
  qtdeCancelada: number | undefined;
  precoDisparo: number | null;
  precoEnvio: number | null;
  precoLimite: number | null;
  precoExecutado: number;
  status: string | null;
  msg: string | null;
}

export interface OrderExecOpenPopupData {
  orderId: number;
  dadosPesquisa: {
    resuladoAtivo: string;
    codigoEspecificacao: string;
    cotacaoAtual: number;
    porcentagem: string;
    ultimoHorario: string;
    stepQtde: number;
    market: string;
    ativo: string;
  };
  ativo: string;
  qtde: number;
  entradaDisparo: number | null;
  entradaExec: number | null;
  preco: string;
  inicioDisparo: number | "";
  gainDisparo: number | "";
  gainExec: number | "";
  stopDisparo: number | "";
  stopExec: number | "";
  ajustePadrao: number | "";
  tabelaOrdens: Array<{
    disparo: number;
    stopAtual: number;
    ajuste: number;
    novoStop: number;
    tipo: string;
  }>;
}
