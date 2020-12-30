import { Order } from "./ordersExec";

export default interface OrdersExecState {
  ativoFiltrarOrdens: string;
  mercadoFiltrarOrdens: string;
  contaFiltrarOrdens: string;
  statusFiltrarOrdens: string;
  dataFiltrarOrdens: string;
  ofertaFiltrarOrdens: string;
  tabelaOrdensExecucao: Array<Order>;
  opcoesOrdemAberto: boolean;
  ordemAtual: Order | null;
  selectQtdeAberto: boolean;
  selectPrecoAberto: boolean;
  sinalInputSelect: "+" | "-";
  esource_ordersExec: EventSource | null;
  interval_ordersExec: NodeJS.Timeout | null;
  filtrarOrdensAberto: boolean;
}
