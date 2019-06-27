import React from "react";
import { VALIDACAO_QTDE } from "../../../contants/Erros";

export const mudarQtdAction = event => {
  return dispatch => {
    let erro = "";
    if (event.target.validationMessage) {
      erro = VALIDACAO_QTDE;
    }
    dispatch({
      type: "mudar_qtde",
      payload: { qtde: event.target.value, erro: erro }
    });
  };
};
