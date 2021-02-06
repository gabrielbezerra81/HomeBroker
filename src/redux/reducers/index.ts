import { combineReducers } from "redux";

import {
  COMPRA_AGENDADA_NAMESPACE,
  COMPRA_MERCADO_NAMESPACE,
  COMPRA_LIMITADA_NAMESPACE,
  COMPRA_STARTSTOP_NAMESPACE,
  COMPRA_STARTMOVEL_NAMESPACE,
  COMPRA_GAINREDUCAO_NAMESPACE,
  VENDA_AGENDADA_NAMESPACE,
  VENDA_LIMITADA_NAMESPACE,
  VENDA_MERCADO_NAMESPACE,
  VENDA_STARTSTOP_NAMESPACE,
  VENDA_STOPMOVEL_NAMESPACE,
  VENDA_GAINREDUCAO_NAMESPACE,
} from "constants/ActionTypes";

import bookOfertaReducer from "modules/boletas/duck/reducers/bookOfertaReducer";
import formInputReducer from "modules/boletas/duck/reducers/formInputReducer";
import appBoletasReducer from "modules/boletas/duck/reducers/appBoletasReducer";
import THLReducer from "modules/thl/duck/THLReducer";
import SystemReducer from "redux/reducers/system/SystemReducer";
import MultilegReducer from "modules/multileg/duck/MultilegReducer";
import PositionReducer from "modules/position/duck/PositionReducer";
import OrdensExecucaoReducer from "modules/ordersExec/duck/OrdensExecReducer";
import FinancialPlannerReducer from "modules/financialPlanner/duck/FinancialPlannerReducer";
import multiBoxReducer from "modules/multiBox/duck/multiBoxReducer";

export const BoletasReducer = combineReducers({
  bookOfertaReducer: bookOfertaReducer,
  compraAgendadaReducer: formInputReducer(COMPRA_AGENDADA_NAMESPACE),
  compraLimitadaReducer: formInputReducer(COMPRA_LIMITADA_NAMESPACE),
  compraMercadoReducer: formInputReducer(COMPRA_MERCADO_NAMESPACE),
  compraStartStopReducer: formInputReducer(COMPRA_STARTSTOP_NAMESPACE),
  compraStartMovelReducer: formInputReducer(COMPRA_STARTMOVEL_NAMESPACE),
  compraGainReducao: formInputReducer(COMPRA_GAINREDUCAO_NAMESPACE),
  vendaAgendadaReducer: formInputReducer(VENDA_AGENDADA_NAMESPACE),
  vendaLimitadaReducer: formInputReducer(VENDA_LIMITADA_NAMESPACE),
  vendaMercadoReducer: formInputReducer(VENDA_MERCADO_NAMESPACE),
  vendaStartStopReducer: formInputReducer(VENDA_STARTSTOP_NAMESPACE),
  vendaStopMovel: formInputReducer(VENDA_STOPMOVEL_NAMESPACE),
  vendaGainReducao: formInputReducer(VENDA_GAINREDUCAO_NAMESPACE),
  appBoletasReducer: appBoletasReducer,
});

export const reducersAppPrincipal = combineReducers({
  systemReducer: SystemReducer,
  multilegReducer: MultilegReducer,
  positionReducer: PositionReducer,
  ordersExecReducer: OrdensExecucaoReducer,
  thlReducer: THLReducer,
  financialPlannerReducer: FinancialPlannerReducer,
  multiBoxReducer,
});

export type BoletasState = ReturnType<typeof BoletasReducer>;

export type MainStoreState = ReturnType<typeof reducersAppPrincipal>;
