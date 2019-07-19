import {
  ABRIR_FORMULARIO,
  FECHAR_FORMULARIO,
  AUMENTAR_ZINDEX
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
  venda_gainreducao: false,
  config_compra: false,
  config_venda: false,
  zIndex: 100
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ABRIR_FORMULARIO:
      return { ...state, [action.name]: action.payload };
    case FECHAR_FORMULARIO:
      return { ...state, [action.name]: action.payload };
    case AUMENTAR_ZINDEX:
      return { ...state, zIndex: action.payload };
    default:
      return state;
  }
};

const True = {
  book: true,
  compra_agendada: true,
  compra_limitada: true,
  compra_mercado: true,
  compra_startstop: true,
  compra_startmovel: true,
  compra_gainreducao: true,
  venda_agendada: true,
  venda_limitada: true,
  venda_mercado: true,
  venda_startstop: true,
  venda_stop_movel: true,
  venda_gainreducao: true
};

const False = {
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
