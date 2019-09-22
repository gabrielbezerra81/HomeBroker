import { MUDAR_VARIAVEL_POSICAO_CUSTODIA } from "constants/MenuActionTypes";

export const mudarVariavelPosicaoAction = (nome, valor) => {
  return dispatch => {
    dispatch({
      type: MUDAR_VARIAVEL_POSICAO_CUSTODIA,
      payload: { nome, valor }
    });
  };
};
