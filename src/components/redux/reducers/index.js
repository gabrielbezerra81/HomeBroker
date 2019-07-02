import { combineReducers } from "redux";
import bookOfertaReducer from "./bookOfertaReducer";
import compraAgendadaReducer from "./compraAgendadaReducer";

export default combineReducers({
  bookOfertaReducer: bookOfertaReducer,
  compraAgendadaReducer: compraAgendadaReducer
});
