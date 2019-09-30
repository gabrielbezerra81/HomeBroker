import { pesquisarAtivoMultilegAPI } from "components/api/API";
import { PESQUISAR_ATIVO_MULTILEG_API } from "constants/ApiActionTypes";

export const pesquisarAtivoMultilegAction = (props, indice) => {
  return async dispatch => {
    let multileg = [...props.multileg];
    const codigo_ativo = multileg[indice].ativo;

    const dados = await pesquisarAtivoMultilegAPI(codigo_ativo);
    if (dados) {
      multileg[indice].opcoes = [...dados.opcoes];
      multileg[indice].vencimento = [...dados.vencimentos];
      multileg[indice].valor = dados.cotacaoAtual;
      multileg[indice].variacao = dados.variacao;
      dispatch({ type: PESQUISAR_ATIVO_MULTILEG_API, payload: multileg });
    }
  };
};
