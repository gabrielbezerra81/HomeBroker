import { MUDAR_VARIAVEL_THL } from "constants/MenuActionTypes";

export const mudarVariavelTHLAction = (nome, valor) => {
  return dispatch => {
    dispatch({
      type: MUDAR_VARIAVEL_THL,
      payload: { nome, valor }
    });
  };
};
