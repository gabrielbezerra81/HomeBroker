import { pesquisarAtivoAPI } from "components/api/API";
import { PESQUISAR_ATIVO_BOLETA_API } from "constants/ApiActionTypes";
import { montaOrdemPrincipal } from "components/utils/MontarOrdens";

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

export const enviarOrdemAction = props => {
  let json = montaOrdemPrincipal(props);
  console.log("ordem", json);

  return dispatch => {};
};
