import { pesquisarAtivoAPI, enviarOrdemAPI } from "api/API";
import { atualizarCotacaoBoletasAPI } from "api/ReativosAPI";
import { PESQUISAR_ATIVO_BOLETA_API } from "constants/ApiActionTypes";
import {
  montaOrdemPrincipal,
  validarOrdemBoleta,
} from "shared/utils/MontarOrdens";
import {
  ATUALIZAR_EVENT_SOURCE_BOLETAS,
  MUDAR_QTDE,
} from "constants/ActionTypes";
import { mudarAtributoBoletaAction } from "redux/actions/boletas/formInputActions";

export const pesquisarAtivoOnEnterAction = (props, namespace) => {
  return async (dispatch, getState) => {
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
      atualizarCotacaoBoletaAction({ dispatch, dadosPesquisa, namespace });
    }
  };
};

const atualizarCotacaoBoletaAction = ({
  dispatch,
  dadosPesquisa,
  namespace,
}) => {
  const codigo = dadosPesquisa.ativo;

  if (codigo) {
    const newSource = atualizarCotacaoBoletasAPI({
      dispatch,
      codigos: codigo,
      dadosPesquisa,
      namespace,
    });

    dispatch({
      type: `${ATUALIZAR_EVENT_SOURCE_BOLETAS}${namespace}`,
      payload: newSource,
    });
  }
};

export const enviarOrdemAction = (props, selectedAccount) => {
  return async (dispatch) => {
    let json = [montaOrdemPrincipal(props, selectedAccount)];
    if (validarOrdemBoleta(props, selectedAccount)) await enviarOrdemAPI(json);
  };
};

const mudarTipoInputQtde = (dadosPesquisa, qtde) => {
  let novaQtde = qtde;
  if (dadosPesquisa.stepQtde === 0.01) novaQtde = novaQtde * 1;
  else novaQtde = Math.floor(novaQtde);
  return novaQtde;
};
