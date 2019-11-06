import {
  ABRIR_FECHAR_MENU_LATERAL,
  LOGAR_DESLOGAR_USUARIO,
  ABRIR_FECHAR_ITEM_BARRA_LATERAL
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
      payload: { usuarioConectado: "Gabriel Alencar", logado: false }
    });
  };
};

export const abrirItemBarraLateralAction = (props, nameVariavelReducer) => {
  if (nameVariavelReducer === "multilegAberto") {
    if (props.eventSourceBook_Multileg) props.eventSourceBook_Multileg.close();
    if (props.eventSourceCotacao_Multileg)
      props.eventSourceCotacao_Multileg.close();
  } //
  else if (nameVariavelReducer === "listaCompletaAberta") {
    if (props.eventSourceEmblema_Posicao)
      props.eventSourceEmblema_Posicao.close();
  }
  return dispatch => {
    dispatch({
      type: ABRIR_FECHAR_ITEM_BARRA_LATERAL,
      payload: {
        name: nameVariavelReducer,
        valor: !props[nameVariavelReducer]
      }
    });
  };
};

export const mouseOverAction = (props, nameVariavelReducer) => {
  return dispatch => {
    dispatch({
      type: ABRIR_FECHAR_ITEM_BARRA_LATERAL,
      payload: { name: nameVariavelReducer, valor: true }
    });
  };
};

export const mouseLeaveAction = (props, nameVariavelReducer) => {
  return dispatch => {
    dispatch({
      type: ABRIR_FECHAR_ITEM_BARRA_LATERAL,
      payload: { name: nameVariavelReducer, valor: false }
    });
  };
};
