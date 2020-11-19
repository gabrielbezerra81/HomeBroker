import { pesquisarAtivoAPI, enviarOrdemAPI } from "api/API";
import { atualizarCotacaoBoletasAPI } from "api/reactive/ReativosAPI";
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
  UPDATE_MANY_BOLETA,
} from "constants/ActionTypes";
import { mudarAtributoBoletaAction } from "redux/actions/boletas/formInputActions";
import produce from "immer";
import { storeAppPrincipal } from "redux/StoreCreation";
import { getProactiveBoletaQuoteAPI } from "api/proactive/ProativosAPI";
import { formatarDataDaAPI } from "shared/utils/Formatacoes";

export const pesquisarAtivoOnEnterAction = (namespace) => {
  return async (dispatch, getState) => {
    const appBoletasState = getState();

    const { ativo } = appBoletasState[namespace];

    dispatch(mudarAtributoBoletaAction(true, namespace, "pesquisandoAtivo"));

    const dadosPesquisa = await pesquisarAtivoAPI(ativo);

    if (dadosPesquisa) {
      dispatch({
        type: `${PESQUISAR_ATIVO_BOLETA_API}${namespace}`,
        payload: dadosPesquisa,
      });
      // TODO: Incluir essa validação dentro do input
      // const newQtde = mudarTipoInputQtde(dadosPesquisa, qtde);
      // dispatch({
      //   type: `${MUDAR_QTDE}${namespace}`,
      //   payload: {
      //     qtde: newQtde,
      //     erro: "",
      //   },
      // });

      dispatch(mudarAtributoBoletaAction(false, namespace, "pesquisandoAtivo"));
    }
  };
};

export const startReactiveBoletaQuoteUpdateAction = (namespace) => {
  return (dispatch, getState) => {
    const appBoletasState = getState();

    const {
      esource_boletaQuote,
      dadosPesquisa,
      interval_boletaQuote,
    } = appBoletasState[namespace];

    if (esource_boletaQuote) {
      esource_boletaQuote.close();
    }

    if (interval_boletaQuote) {
      clearInterval(interval_boletaQuote);
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
          draft.unshift(data[0]);
        });
        storeAppPrincipal.dispatch({
          type: LISTAR_ORDENS_EXECUCAO,
          payload: updatedOrders,
        });
      }
    }
  };
};

export const startProactiveBoletaQuoteUpdateAction = (namespace) => {
  return async (dispatch, getState) => {
    const appBoletasState = getState();
    const {
      systemReducer: { updateInterval },
    } = storeAppPrincipal.getState();

    const {
      esource_boletaQuote,
      dadosPesquisa,
      interval_boletaQuote,
    } = appBoletasState[namespace];

    if (esource_boletaQuote) {
      esource_boletaQuote.close();
    }

    if (interval_boletaQuote) {
      clearInterval(interval_boletaQuote);
    }

    const { ativo: symbol } = dadosPesquisa;

    if (symbol) {
      const interval = setInterval(async () => {
        const data = await getProactiveBoletaQuoteAPI(symbol);

        if (data) {
          const { quote, lastDate } = data;

          const updatedSearchData = produce(dadosPesquisa, (draft) => {
            draft.cotacaoAtual = quote;
            draft.ultimoHorario = formatarDataDaAPI(
              lastDate,
            ).toLocaleTimeString();
          });

          dispatch({
            type: `${PESQUISAR_ATIVO_BOLETA_API}${namespace}`,
            payload: updatedSearchData,
          });
        }
      }, updateInterval);

      dispatch({
        type: `${UPDATE_MANY_BOLETA}${namespace}`,
        payload: { interval_boletaQuote: interval },
      });
    }
  };
};
