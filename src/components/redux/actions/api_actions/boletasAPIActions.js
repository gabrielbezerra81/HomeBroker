import { pesquisarAtivoAPI } from "components/api/API";
import { PESQUISAR_ATIVO_BOLETA_API } from "constants/ApiActionTypes";

export const pesquisarAtivoOnEnterAction = (codigo, namespace) => {
  return async dispatch => {
    const dadosPesquisa = await pesquisarAtivoAPI(codigo);

    if (dadosPesquisa)
      dispatch({
        type: `${PESQUISAR_ATIVO_BOLETA_API}${namespace}`,
        payload: dadosPesquisa
      });
  };
};
