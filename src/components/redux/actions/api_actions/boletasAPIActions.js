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
import {
  ATUALIZAR_EVENT_SOURCE_BOLETAS,
  MUDAR_QTDE,
} from "constants/ActionTypes";

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
      const qtde = mudarTipoInputQtde(dadosPesquisa, props.qtde);
      dispatch({
        type: `${MUDAR_QTDE}${namespace}`,
        payload: {
          qtde: qtde,
          erro: "",
        },
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
    if (validarOrdemBoleta(props, contaSelecionada))
      await enviarOrdemAPI(json, token);
  };
};

const mudarTipoInputQtde = (dadosPesquisa, qtde) => {
  let novaQtde = qtde;
  if (dadosPesquisa.stepQtde === 0.01) novaQtde = novaQtde * 1;
  else novaQtde = Math.floor(novaQtde);
  return novaQtde;
};
