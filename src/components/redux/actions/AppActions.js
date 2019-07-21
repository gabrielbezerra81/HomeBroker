import {
  ABRIR_FORMULARIO,
  FECHAR_FORMULARIO,
  AUMENTAR_ZINDEX
} from "../../../constants/ActionTypes";

//Usado apenas na store local de cada sub-app para abrir os forms de configuração de start/stop movel
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

//Usado apenas na store local de cada sub-app para abrir os forms de configuração de start/stop movel
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

export const aumentarZindex = (zIndex, dispatch) => {
  zIndex = zIndex + 1;
  dispatch({ type: AUMENTAR_ZINDEX, payload: zIndex });
};
