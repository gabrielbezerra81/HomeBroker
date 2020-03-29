import { MUDAR_VARIAVEL_THL } from "constants/MenuActionTypes";
import {
  pesquisarListaStrikeTHLAPI,
  travarDestravarClique
} from "components/api/API";

export const mudarVariavelTHLAction = (nome, valor) => {
  return dispatch => {
    dispatch({
      type: MUDAR_VARIAVEL_THL,
      payload: { nome, valor }
    });
  };
};

export const pesquisarAtivoTHLAction = codigo => {
  return async dispatch => {
    travarDestravarClique("travar", "thl");
    const listaStrikes = await pesquisarListaStrikeTHLAPI(codigo);
    travarDestravarClique("destravar", "thl");

    if (listaStrikes.length > 0) {
      dispatch({
        type: MUDAR_VARIAVEL_THL,
        payload: { nome: "listaStrikes", valor: listaStrikes }
      });
    }
  };
};
