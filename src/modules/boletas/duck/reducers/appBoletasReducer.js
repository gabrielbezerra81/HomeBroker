import {
  ABRIR_FORMULARIO,
  FECHAR_FORMULARIO,
  AUMENTAR_ZINDEX,
  RECEBER_APPKEYLOCAL,
} from "constants/ActionTypes";

const INITIAL_STATE = {
  config_compra: false,
  config_venda: false,
  zIndex: 100,
  appProps: {},
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ABRIR_FORMULARIO:
      return { ...state, [action.name]: action.payload };
    case FECHAR_FORMULARIO:
      return { ...state, [action.name]: action.payload };
    case AUMENTAR_ZINDEX:
      return { ...state, zIndex: action.payload };
    case RECEBER_APPKEYLOCAL:
      return { ...state, appProps: action.payload };
    default:
      return state;
  }
};
