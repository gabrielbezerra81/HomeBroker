import {
  ABRIR_FECHAR_MENU_LATERAL,
  LOGAR_DESLOGAR_USUARIO
} from "constants/ActionTypes";

const INITIAL_STATE = {
  usuarioConectado: "Gabriel Alencar",
  menuLateralAberto: true,
  logado: true,
  valorLiquido: "15.000,00",
  valorComprar: "3.000,00",
  ativo: "Bender"
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ABRIR_FECHAR_MENU_LATERAL:
      return { ...state, menuLateralAberto: action.payload };
    case LOGAR_DESLOGAR_USUARIO:
      return {
        ...state,
        usuarioConectado: action.payload.usuarioConectado,
        logado: action.payload.logado
      };
    default:
      return state;
  }
};
