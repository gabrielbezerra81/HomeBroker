import {
  ABRIR_FORMULARIO,
  FECHAR_FORMULARIO,
  AUMENTAR_ZINDEX
} from "../../../constants/ActionTypes";

export const abrirFormularioAction = (event, props) => {
  const name = event.target.getAttribute("name");

  return dispatch => {
    dispatch({
      type: ABRIR_FORMULARIO,
      name: name,
      payload: true
    });

    aumentarZindex(props.zIndex, dispatch);
  };
};

export const fecharFormularioAction = event => {
  const name = event.target.getAttribute("name");
  return dispatch => {
    dispatch({
      type: FECHAR_FORMULARIO,
      name: name,
      payload: false
    });
  };
};

export const aumentarZindexAction = (div_id, zIndex) => {
  return dispatch => {
    zIndex = zIndex + 1;
    document.getElementById(div_id).style.zIndex = zIndex;
    dispatch({ type: AUMENTAR_ZINDEX, payload: zIndex });
  };
};
export const aumentarZindex = (zIndex, dispatch) => {
  zIndex = zIndex + 1;
  dispatch({ type: AUMENTAR_ZINDEX, payload: zIndex });
};
