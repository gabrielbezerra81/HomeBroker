import {
  ABRIR_FORMULARIO,
  FECHAR_FORMULARIO
} from "../../../constants/ActionTypes";

export const abrirFormularioAction = event => {
  const name = event.target.getAttribute("name");
  return dispatch => {
    dispatch({
      type: ABRIR_FORMULARIO,
      name: name,
      payload: true
    });
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
