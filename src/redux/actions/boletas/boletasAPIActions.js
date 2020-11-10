import { pesquisarAtivoAPI, enviarOrdemAPI } from "api/API";
import { atualizarCotacaoBoletasAPI } from "api/ReativosAPI";
import {
  LISTAR_ORDENS_EXECUCAO,
  PESQUISAR_ATIVO_BOLETA_API,
} from "constants/ApiActionTypes";
import {
  montaOrdemPrincipal,
  validarOrdemBoleta,
} from "shared/utils/MontarOrdens";
import {
  ATUALIZAR_EVENT_SOURCE_BOLETAS,
  MUDAR_QTDE,
} from "constants/ActionTypes";
import { mudarAtributoBoletaAction } from "redux/actions/boletas/formInputActions";
import produce from "immer";
import { storeAppPrincipal } from "redux/StoreCreation";

export const pesquisarAtivoOnEnterAction = (namespace) => {
  return async (dispatch, getState) => {
    const appBoletasState = getState();

    const { ativo, qtde } = appBoletasState[namespace];

    dispatch(mudarAtributoBoletaAction(true, namespace, "pesquisandoAtivo"));

    const dadosPesquisa = await pesquisarAtivoAPI(ativo);

    if (dadosPesquisa) {
      dispatch({
        type: `${PESQUISAR_ATIVO_BOLETA_API}${namespace}`,
        payload: dadosPesquisa,
      });
      const newQtde = mudarTipoInputQtde(dadosPesquisa, qtde);
      dispatch({
        type: `${MUDAR_QTDE}${namespace}`,
        payload: {
          qtde: newQtde,
          erro: "",
        },
      });

      dispatch(mudarAtributoBoletaAction(false, namespace, "pesquisandoAtivo"));
    }
  };
};

export const startBoletaQuoteUpdateAction = (namespace) => {
  return (dispatch, getState) => {
    const appBoletasState = getState();

    const { esource_boletaQuote, dadosPesquisa } = appBoletasState[namespace];

    if (esource_boletaQuote) {
      esource_boletaQuote.close();
    }

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
};

export const enviarOrdemAction = (props, selectedAccount) => {
  return async () => {
    const {
      ordersExecReducer: { tabelaOrdensExecucao },
    } = storeAppPrincipal.getState();

    let json = [montaOrdemPrincipal(props, selectedAccount)];
    if (validarOrdemBoleta(props, selectedAccount)) {
      const data = await enviarOrdemAPI(json);

      if (data && data.length) {
        const updatedOrders = produce(tabelaOrdensExecucao, (draft) => {
          draft.push(data[0]);
        });
        storeAppPrincipal.dispatch({
          type: LISTAR_ORDENS_EXECUCAO,
          payload: updatedOrders,
        });
      }
    }
  };
};

const mudarTipoInputQtde = (dadosPesquisa, qtde) => {
  let novaQtde = qtde;
  if (dadosPesquisa.stepQtde === 0.01) novaQtde = novaQtde * 1;
  else novaQtde = Math.floor(novaQtde);
  return novaQtde;
};
