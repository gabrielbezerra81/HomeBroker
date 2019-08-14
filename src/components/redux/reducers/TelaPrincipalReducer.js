import {
  ABRIR_FECHAR_MENU_LATERAL,
  LOGAR_DESLOGAR_USUARIO,
  ABRIR_FECHAR_ORDENS_EXECUCAO,
  ABRIR_FECHAR_ORDENS
} from "constants/ActionTypes";

const INITIAL_STATE = {
  usuarioConectado: "Gabriel Alencar",
  menuLateralAberto: true,
  logado: true,
  valorLiquido: "15.000,00",
  valorComprar: "3.000,00",
  ativo: "Bender",
  ordensAberto: false,
  ordensExecucaoAberto: false
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
    case ABRIR_FECHAR_ORDENS:
      return { ...state, ordensAberto: action.payload };
    case ABRIR_FECHAR_ORDENS_EXECUCAO:
      return { ...state, ordensExecucaoAberto: action.payload };
    default:
      return state;
  }
};
