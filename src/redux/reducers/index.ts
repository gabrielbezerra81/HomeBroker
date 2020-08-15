import { combineReducers } from "redux";
import bookOfertaReducer from "./boletas/bookOfertaReducer";
import formInputReducer from "./boletas/formInputReducer";
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
import appBoletasReducer from "./boletas/appBoletasReducer";
import THLReducer from "./thl/THLReducer";
import TelaPrincipalReducer from "redux/reducers/telaPrincipal/TelaPrincipalReducer";
import MultilegReducer from "redux/reducers/multileg/MultilegReducer";
import PosicaoReducer from "redux/reducers/posicao/PosicaoReducer";
import OrdensExecucaoReducer from "redux/reducers/ordensExecucao/OrdensExecReducer";

export const BoletasReducer = combineReducers({
  bookOfertaReducer: bookOfertaReducer,
  formInputReducer: formInputReducer("_DEMAIS"),
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
  telaPrincipalReducer: TelaPrincipalReducer,
  multilegReducer: MultilegReducer,
  posicaoReducer: PosicaoReducer,
  ordensExecReducer: OrdensExecucaoReducer,
  THLReducer: THLReducer,
});

export type BoletasState = ReturnType<typeof BoletasReducer>;

export type MainStoreState = ReturnType<typeof reducersAppPrincipal>;
