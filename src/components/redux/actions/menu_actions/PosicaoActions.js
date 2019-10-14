import { MUDAR_VARIAVEL_POSICAO_CUSTODIA } from "constants/MenuActionTypes";
import { listarPosicoesAPI } from "components/api/API";

export const mudarVariavelPosicaoAction = (nome, valor) => {
  return dispatch => {
    dispatch({
      type: MUDAR_VARIAVEL_POSICAO_CUSTODIA,
      payload: { nome, valor }
    });
  };
};

export const listarPosicoesAction = () => {
  return async dispatch => {
    const listaPosicoes = await listarPosicoesAPI();
    console.log(listaPosicoes);
    dispatch({
      type: MUDAR_VARIAVEL_POSICAO_CUSTODIA,
      payload: { nome: "posicoesCustodia", valor: listaPosicoes }
    });
  };
};
