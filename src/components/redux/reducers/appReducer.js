import {
  ABRIR_FORMULARIO,
  FECHAR_FORMULARIO
} from "../../../constants/ActionTypes";
import { formatarNumero } from "./formInputReducer";

const INITIAL_STATE = {
  book: false,
  compra_agendada: false,
  compra_limitada: false,
  compra_mercado: false,
  compra_startstop: false,
  compra_startmovel: false,
  compra_gainreducao: false,
  venda_agendada: false,
  venda_limitada: false,
  venda_mercado: false,
  venda_startstop: false,
  venda_stop_movel: false,
  venda_gainreducao: false
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ABRIR_FORMULARIO:
      return { ...state, [action.name]: action.payload };
    case FECHAR_FORMULARIO:
      return { ...state, [action.name]: action.payload };
    default:
      return state;
  }
};
