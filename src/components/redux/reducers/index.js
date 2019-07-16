import { combineReducers } from "redux";
import bookOfertaReducer from "./bookOfertaReducer";
import formInputReducer from "./formInputReducer";
import {
  COMPRA_AGENDADA_NAMESPACE,
  COMPRA_MERCADO_NAMESPACE,
  COMPRA_LIMITADA_NAMESPACE,
  COMPRA_STARTSTOP_NAMESPACE,
  COMPRA_STARTMOVEL_NAMESPACE,
  COMPRA_GAINREDUCAO_NAMESPACE,
  VENDA_STOPMOVEL_NAMESPACE,
  VENDA_GAINREDUCAO_NAMESPACE,
  VENDA_AGENDADA_NAMESPACE
} from "../../../constants/ActionTypes";

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
  vendaStopMovel: formInputReducer(VENDA_STOPMOVEL_NAMESPACE),
  vendaGainReducao: formInputReducer(VENDA_GAINREDUCAO_NAMESPACE)
});
