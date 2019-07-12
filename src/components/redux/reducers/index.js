import { combineReducers } from "redux";
import bookOfertaReducer from "./bookOfertaReducer";
import formInputReducer from "./formInputReducer";

export default combineReducers({
  bookOfertaReducer: bookOfertaReducer,
  formInputReducer: formInputReducer
});
