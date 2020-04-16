import {
  pesquisarAtivoAPI,
  enviarOrdemAPI,
  atualizarCotacaoAPI,
} from "components/api/API";
import { PESQUISAR_ATIVO_BOLETA_API } from "constants/ApiActionTypes";
import {
  montaOrdemPrincipal,
  validarOrdemBoleta,
} from "components/utils/MontarOrdens";
import { ATUALIZAR_EVENT_SOURCE_BOLETAS } from "constants/ActionTypes";

export const pesquisarAtivoOnEnterAction = (props, namespace) => {
  return async (dispatch) => {
    if (props.eventSourceCotacao) {
      props.eventSourceCotacao.close();
    }

    document.body.style.cursor = "wait";
    const dadosPesquisa = await pesquisarAtivoAPI(props.ativo);
    document.body.style.cursor = "auto";

    if (dadosPesquisa) {
      dispatch({
        type: `${PESQUISAR_ATIVO_BOLETA_API}${namespace}`,
        payload: dadosPesquisa,
      });
      atualizarCotacaoBoletaAction(dispatch, props, dadosPesquisa, namespace);
    }
  };
};

const atualizarCotacaoBoletaAction = (
  dispatch,
  props,
  dadosPesquisa,
  namespace
) => {
  const codigo = dadosPesquisa.ativo;

  const newSource = atualizarCotacaoAPI(
    dispatch,
    props,
    codigo,
    "boletas",
    [],
    namespace,
    dadosPesquisa
  );

  dispatch({
    type: `${ATUALIZAR_EVENT_SOURCE_BOLETAS}${namespace}`,
    payload: newSource,
  });
};

export const enviarOrdemAction = (props, contaSelecionada, token) => {
  return async (dispatch) => {
    let json = [montaOrdemPrincipal(props, contaSelecionada)];

    if (validarOrdemBoleta(props)) await enviarOrdemAPI(json, token);
  };
};
