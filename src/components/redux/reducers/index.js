import { combineReducers } from "redux";
import bookOfertaReducer from "./boletas_reducer/bookOfertaReducer";
import formInputReducer from "./boletas_reducer/formInputReducer";
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
  VENDA_GAINREDUCAO_NAMESPACE
} from "constants/ActionTypes";
import SubAppReducer from "./SubAppReducer";
import THLReducer from "./menu_reducer/THLReducer";
import TelaPrincipalReducer from "components/redux/reducers/TelaPrincipalReducer";
import MultilegReducer from "components/redux/reducers/menu_reducer/MultilegReducer";
import PosicaoReducer from "components/redux/reducers/menu_reducer/PosicaoReducer";
import OrdensExecucaoReducer from "components/redux/reducers/menu_reducer/OrdensExecReducer";

export default combineReducers({
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
  SubAppReducer: SubAppReducer
});

export const combinedReducersAppPrincipal = combineReducers({
  telaPrincipalReducer: TelaPrincipalReducer,
  multilegReducer: MultilegReducer,
  posicaoReducer: PosicaoReducer,
  ordensExecReducer: OrdensExecucaoReducer,
  THLReducer: THLReducer
});
