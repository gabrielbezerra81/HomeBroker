import { MUDAR_VARIAVEL_ORDENS_EXEC } from "constants/MenuActionTypes";
import { listarOrdensExecAPI } from "components/api/API";
import { LISTAR_ORDENS_EXECUCAO } from "constants/ApiActionTypes";

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

export const listarOrdensExecAction = () => {
  return async dispatch => {
    const ordensExec = await listarOrdensExecAPI();

    dispatch({ type: LISTAR_ORDENS_EXECUCAO, payload: ordensExec });
  };
};
