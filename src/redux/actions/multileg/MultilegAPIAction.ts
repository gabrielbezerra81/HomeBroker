import {
  pesquisarAtivoMultilegAPI,
  enviarOrdemAPI,
  travarDestravarClique,
  criarAlertaOperacaoAPI,
  criarPosicaoMultilegAPI,
} from "api/API";
import { PESQUISAR_ATIVO_MULTILEG_API } from "constants/ApiActionTypes";
import { updateMultilegQuotesAction } from "redux/actions/multileg/MultilegActions";
import {
  mountMultilegOrder,
  validateMultilegOrder,
  AddNewMultilegQuote,
  findClosestStrike,
  updateMultilegState,
} from "./utils";
import { MainThunkAction } from "types/ThunkActions";
import {
  MultilegQuote,
  MultilegTab,
  MultilegOption,
} from "types/multileg/multileg";

////

export const searchMultilegSymbolAPIAction = (
  tabIndex: number,
): MainThunkAction => {
  return async (dispatch, getState) => {
    const {
      systemReducer: { token },
      multilegReducer: {
        eventSourceCotacao,
        setIntervalCotacoesMultileg,
        multileg,
        cotacoesMultileg,
      },
    } = getState();

    dispatch(
      updateMultilegState({
        attributeName: "pesquisandoAtivo",
        attributeValue: true,
      }),
    );
    const data = await searchMultilegSymbolData({
      multilegTabs: multileg,
      tabIndex,
      multilegQuotes: cotacoesMultileg,
    });
    dispatch({
      type: PESQUISAR_ATIVO_MULTILEG_API,
      payload: data.multilegTabs,
    });

    dispatch(
      updateMultilegState({
        attributeName: "cotacoesMultileg",
        attributeValue: data.multilegQuotes,
      }),
    );
    updateMultilegQuotesAction({
      dispatch,
      multilegQuotes: data.multilegQuotes,
      eventSourceMultilegQuotes: eventSourceCotacao,
      token,
      setIntervalMultilegQuotes: setIntervalCotacoesMultileg,
    });
    dispatch(
      updateMultilegState({
        attributeName: "pesquisandoAtivo",
        attributeValue: false,
      }),
    );
  };
};

interface searchSymbolData {
  multilegTabs: MultilegTab[];
  tabIndex: number;
  multilegQuotes: MultilegQuote[];
}

export const searchMultilegSymbolData = async ({
  multilegQuotes,
  multilegTabs,
  tabIndex,
}: searchSymbolData) => {
  let updatedMultilegTabs = [...multilegTabs];
  let multilegTab = multilegTabs[tabIndex];
  const symbol = multilegTab.ativo;

  const data = await pesquisarAtivoMultilegAPI(symbol);

  if (data) {
    AddNewMultilegQuote({
      multilegQuotes,
      symbol,
      quote: data.cotacaoAtual,
    });

    const symbolIsOption = symbol !== data.ativoPrincipal ? true : false;

    multilegTab.opcoes = [...data.opcoes].sort(
      (a: MultilegOption, b: MultilegOption) => a.strike - b.strike,
    );
    multilegTab.vencimento = [...data.vencimentos];
    multilegTab.variacao = data.variacao;
    multilegTab.vencimentoSelecionado = multilegTab.opcoes[0].expiration;
    multilegTab.strikeSelecionado = findClosestStrike({
      options: data.opcoes,
      symbolQuote: data.cotacaoAtual,
      symbol,
      symbolIsOption,
    });
    multilegTab.ativoAtual = data.ativoPrincipal;
  }

  return { multilegTabs: updatedMultilegTabs, multilegQuotes };
};

export const sendMultilegOrderAction = (tabIndex: number): MainThunkAction => {
  return async (dispatch, getState) => {
    const {
      multilegReducer: { multileg },
      systemReducer: { contaSelecionada },
    } = getState();

    const mountOrderProps = {
      multilegTabs: multileg,
      selectedAccount: contaSelecionada,
      tabIndex,
    };

    const multilegRequestData = mountMultilegOrder(mountOrderProps);

    travarDestravarClique("travar", "multileg");

    if (validateMultilegOrder(mountOrderProps))
      await enviarOrdemAPI(multilegRequestData);

    travarDestravarClique("destravar", "multileg");
  };
};

export const createMultilegAlertAction = (
  tabIndex: number,
): MainThunkAction => {
  return async (dispatch, getState) => {
    const {
      multilegReducer: { multileg },
      systemReducer: { contaSelecionada },
    } = getState();

    const mountOrderProps = {
      multilegTabs: multileg,
      selectedAccount: contaSelecionada,
      tabIndex,
    };

    const multilegRequestData = mountMultilegOrder(mountOrderProps);

    travarDestravarClique("travar", "multileg");
    if (validateMultilegOrder(mountOrderProps))
      await criarAlertaOperacaoAPI(multilegRequestData);
    travarDestravarClique("destravar", "multileg");
  };
};

export const createMultilegPositionAction = (
  tabIndex: number,
): MainThunkAction => {
  return async (dispatch, getState) => {
    const {
      multilegReducer: { multileg },
      systemReducer: { contaSelecionada },
    } = getState();

    const mountOrderProps = {
      multilegTabs: multileg,
      selectedAccount: contaSelecionada,
      tabIndex,
    };

    const multilegRequestData = mountMultilegOrder(mountOrderProps);

    travarDestravarClique("travar", "multileg");
    if (validateMultilegOrder(mountOrderProps))
      await criarPosicaoMultilegAPI(multilegRequestData);
    travarDestravarClique("destravar", "multileg");
  };
};
