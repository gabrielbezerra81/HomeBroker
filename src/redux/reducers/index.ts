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
import boletaReducer from "modules/boletas/duck/reducers/boletaReducer";
import appBoletasReducer from "modules/boletas/duck/reducers/appBoletasReducer";
import THLReducer from "modules/thl/duck/THLReducer";
import SystemReducer from "redux/reducers/system/SystemReducer";
import MultilegReducer from "modules/multileg/duck/MultilegReducer";
import PositionReducer from "modules/position/duck/PositionReducer";
import OrdensExecucaoReducer from "modules/ordersExec/duck/OrdensExecReducer";
import FinancialPlannerReducer from "modules/financialPlanner/duck/FinancialPlannerReducer";
import multiBoxReducer from "modules/multiBox/duck/multiBoxReducer";
import CategoryListReducer from "modules/categoryList/duck/CategoryListReducer";
import optionsTableReducer from "modules/optionsTable/duck/optionsTableReducer";

export const BoletasReducer = combineReducers({
  bookOfertaReducer: bookOfertaReducer,
  compraAgendadaReducer: boletaReducer(COMPRA_AGENDADA_NAMESPACE),
  compraLimitadaReducer: boletaReducer(COMPRA_LIMITADA_NAMESPACE),
  compraMercadoReducer: boletaReducer(COMPRA_MERCADO_NAMESPACE),
  compraStartStopReducer: boletaReducer(COMPRA_STARTSTOP_NAMESPACE),
  compraStartMovelReducer: boletaReducer(COMPRA_STARTMOVEL_NAMESPACE),
  compraGainReducao: boletaReducer(COMPRA_GAINREDUCAO_NAMESPACE),
  vendaAgendadaReducer: boletaReducer(VENDA_AGENDADA_NAMESPACE),
  vendaLimitadaReducer: boletaReducer(VENDA_LIMITADA_NAMESPACE),
  vendaMercadoReducer: boletaReducer(VENDA_MERCADO_NAMESPACE),
  vendaStartStopReducer: boletaReducer(VENDA_STARTSTOP_NAMESPACE),
  vendaStopMovel: boletaReducer(VENDA_STOPMOVEL_NAMESPACE),
  vendaGainReducao: boletaReducer(VENDA_GAINREDUCAO_NAMESPACE),
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
  categoryListReducer: CategoryListReducer,
  optionsTableReducer,
});

export type BoletasState = ReturnType<typeof BoletasReducer>;

export type MainStoreState = ReturnType<typeof reducersAppPrincipal>;
