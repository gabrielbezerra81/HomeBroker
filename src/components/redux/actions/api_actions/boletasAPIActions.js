import { pesquisarAtivoAPI, enviarOrdemAPI } from "components/api/API";
import { PESQUISAR_ATIVO_BOLETA_API } from "constants/ApiActionTypes";
import { montaOrdemPrincipal } from "components/utils/MontarOrdens";

export const pesquisarAtivoOnEnterAction = (codigo, namespace) => {
  return async dispatch => {
    document.body.style.cursor = "wait";
    const dadosPesquisa = await pesquisarAtivoAPI(codigo);
    document.body.style.cursor = "auto";

    if (dadosPesquisa)
      dispatch({
        type: `${PESQUISAR_ATIVO_BOLETA_API}${namespace}`,
        payload: dadosPesquisa
      });
  };
};

export const enviarOrdemAction = props => {
  return async dispatch => {
    let json = [montaOrdemPrincipal(props)];

    const resposta = await enviarOrdemAPI(json);
  };
};
