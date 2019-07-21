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

export const aumentarZindexAction = (div_id, zIndex, show) => {
  return dispatch => {
    if (show) {
      zIndex = zIndex + 1;
      document.getElementById(div_id).style.zIndex = zIndex;
      dispatch({ type: AUMENTAR_ZINDEX, payload: zIndex, divkey: div_id });
    }
  };
};
export const aumentarZindex = (zIndex, dispatch) => {
  zIndex = zIndex + 1;
  dispatch({ type: AUMENTAR_ZINDEX, payload: zIndex });
};
