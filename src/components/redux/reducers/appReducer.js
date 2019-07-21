import {
  ABRIR_FORMULARIO,
  FECHAR_FORMULARIO,
  AUMENTAR_ZINDEX
} from "../../../constants/ActionTypes";
import { formatarNumero } from "./formInputReducer";

const INITIAL_STATE = {
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
