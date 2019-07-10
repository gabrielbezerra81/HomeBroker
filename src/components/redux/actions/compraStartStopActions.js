import { FECHAR_CONFIGURAR_STOP } from "../../../constants/ActionTypes";

export const mostrarConfigurarStopAction = event => {
  return dispatch => {
    dispatch({
      type: FECHAR_CONFIGURAR_STOP
    });
  };
};
