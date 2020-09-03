import {
  pesquisarAtivoMultilegAPI,
  enviarOrdemAPI,
  setPointerWhileAwaiting,
  criarAlertaOperacaoAPI,
  criarPosicaoMultilegAPI,
} from "api/API";
import { updateMultilegQuotesAction } from "redux/actions/multileg/MultilegActions";
import {
  mountMultilegOrder,
  validateMultilegOrder,
  AddNewMultilegQuote,
  findClosestStrike,
  updateOneMultilegState,
  updateManyMultilegState,
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
      updateOneMultilegState({
        attributeName: "pesquisandoAtivo",
        attributeValue: true,
      }),
    );
    const data = await searchMultilegSymbolData({
      multilegTabs: multileg,
      tabIndex,
      multilegQuotes: cotacoesMultileg,
    });

    dispatch(
      updateManyMultilegState({
        cotacoesMultileg: data.multilegQuotes,
        multileg: data.multilegTabs,
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
      updateOneMultilegState({
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
      systemReducer: { selectedAccount },
    } = getState();

    const mountOrderProps = {
      multilegTabs: multileg,
      selectedAccount: selectedAccount,
      tabIndex,
    };

    const multilegRequestData = mountMultilegOrder(mountOrderProps);

    setPointerWhileAwaiting("travar", "multileg");

    if (validateMultilegOrder(mountOrderProps))
      await enviarOrdemAPI(multilegRequestData);

    setPointerWhileAwaiting("destravar", "multileg");
  };
};

export const createMultilegAlertAction = (
  tabIndex: number,
): MainThunkAction => {
  return async (dispatch, getState) => {
    const {
      multilegReducer: { multileg },
      systemReducer: { selectedAccount },
    } = getState();

    const mountOrderProps = {
      multilegTabs: multileg,
      selectedAccount: selectedAccount,
      tabIndex,
    };

    const multilegRequestData = mountMultilegOrder(mountOrderProps);

    setPointerWhileAwaiting("travar", "multileg");
    if (validateMultilegOrder(mountOrderProps))
      await criarAlertaOperacaoAPI(multilegRequestData);
    setPointerWhileAwaiting("destravar", "multileg");
  };
};

export const createMultilegPositionAction = (
  tabIndex: number,
): MainThunkAction => {
  return async (dispatch, getState) => {
    const {
      multilegReducer: { multileg },
      systemReducer: { selectedAccount },
    } = getState();

    const mountOrderProps = {
      multilegTabs: multileg,
      selectedAccount: selectedAccount,
      tabIndex,
    };

    const multilegRequestData = mountMultilegOrder(mountOrderProps);

    setPointerWhileAwaiting("travar", "multileg");
    if (validateMultilegOrder(mountOrderProps))
      await criarPosicaoMultilegAPI(multilegRequestData);
    setPointerWhileAwaiting("destravar", "multileg");
  };
};
