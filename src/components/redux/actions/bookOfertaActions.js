import { VALIDACAO_QTDE } from "../../../constants/Erros";
import { MUDAR_QTDE } from "../../../constants/ActionTypes";

export const mudarQtdAction = event => {
  return dispatch => {
    let erro = "";
    if (event.target.validationMessage) {
      erro = VALIDACAO_QTDE;
    }
    dispatch({
      type: MUDAR_QTDE,
      payload: { qtde: event.target.value, erro: erro }
    });
  };
};

export const venderAction = () => {
  return dispatch => {
    console.log("vendeu");
    dispatch({ type: "" });
  };
};

export const comprarAction = () => {
  return dispatch => {
    console.log("comprou");
    dispatch({ type: "" });
  };
};
