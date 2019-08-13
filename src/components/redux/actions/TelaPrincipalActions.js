import {
  ABRIR_FECHAR_MENU_LATERAL,
  LOGAR_DESLOGAR_USUARIO
} from "constants/ActionTypes";

export const abrirFecharMenuLateralAction = (event, menuLateralAberto) => {
  return dispatch => {
    if (menuLateralAberto)
      dispatch({ type: ABRIR_FECHAR_MENU_LATERAL, payload: false });
    else dispatch({ type: ABRIR_FECHAR_MENU_LATERAL, payload: true });
  };
};

export const logarUsuarioAction = (event, props) => {
  return dispatch => {
    dispatch({
      type: LOGAR_DESLOGAR_USUARIO,
      payload: { usuarioConectado: "Gabriel Alencar", logado: true }
    });
  };
};

export const deslogarUsuarioAction = (event, props) => {
  return dispatch => {
    dispatch({
      type: LOGAR_DESLOGAR_USUARIO,
      payload: { usuarioConectado: "", logado: false }
    });
  };
};
