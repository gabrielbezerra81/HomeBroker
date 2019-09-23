import { MUDAR_VARIAVEL_ORDENS_EXEC } from "constants/MenuActionTypes";

export const mudarVariavelOrdensExecAction = (nome, valor) => {
  return dispatch => {
    dispatch({
      type: MUDAR_VARIAVEL_ORDENS_EXEC,
      payload: { nome, valor }
    });
  };
};

export const filtrarHistoricoOpAction = () => {
  return dispatch => {};
};
