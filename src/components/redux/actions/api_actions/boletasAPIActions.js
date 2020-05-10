import { pesquisarAtivoAPI, enviarOrdemAPI } from "components/api/API";
import { atualizarCotacaoAPI } from "components/api/ReativosAPI";
import { PESQUISAR_ATIVO_BOLETA_API } from "constants/ApiActionTypes";
import {
  montaOrdemPrincipal,
  validarOrdemBoleta,
} from "components/utils/MontarOrdens";
import {
  ATUALIZAR_EVENT_SOURCE_BOLETAS,
  MUDAR_QTDE,
} from "constants/ActionTypes";
import { mudarAtributoBoletaAction } from "components/redux/actions/formInputActions";

export const pesquisarAtivoOnEnterAction = (props, namespace) => {
  return async (dispatch) => {
    if (props.eventSourceCotacao) {
      props.eventSourceCotacao.close();
    }
    dispatch(mudarAtributoBoletaAction(true, namespace, "pesquisandoAtivo"));

    const dadosPesquisa = await pesquisarAtivoAPI(props.ativo);

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

      dispatch(mudarAtributoBoletaAction(false, namespace, "pesquisandoAtivo"));
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
