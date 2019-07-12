import { combineReducers } from "redux";
import bookOfertaReducer from "./bookOfertaReducer";
import formInputReducer from "./formInputReducer";

export default combineReducers({
  bookOfertaReducer: bookOfertaReducer,
  formInputReducer: formInputReducer("_DEMAIS"),
  compraAgendadaReducer: formInputReducer("_COMPRA_AGENDADA"),
  compraLimitadaReducer: formInputReducer("_COMPRA_LIMITADA")
});
