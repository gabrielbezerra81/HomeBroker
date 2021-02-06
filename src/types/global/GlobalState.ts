import { OrderExecOpenPopupData } from "modules/ordersExec/types/ordersExec";
import { AppShow } from "./global";
import { ReactNode } from "react";

export default interface GlobalState {
  apps: Array<ReactNode>;
  show: Array<AppShow>;
  divkey: string;
  zIndex: number;
  dadosOrdemExec: OrderExecOpenPopupData | null;
  ultimaBoletaAbertaOrdemExec: string;
}
