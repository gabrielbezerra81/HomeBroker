import {
  pesquisarAtivoMultilegAPI,
  enviarOrdemAPI,
  travarDestravarClique,
  criarAlertaOperacaoAPI,
  criarPosicaoMultilegAPI,
} from "api/API";
import { PESQUISAR_ATIVO_MULTILEG_API } from "constants/ApiActionTypes";
import { atualizarCotacaoMultilegAction } from "redux/actions/multileg/MultilegActions";
import {
  montarOrdemMultileg,
  validarOrdemMultileg,
  adicionaCotacoesMultileg,
  encontrarNumMaisProximo,
  modificarVariavelMultileg,
} from "./utils";
import { MainThunkAction } from "types/ThunkActions";
import { MultilegQuote, MultilegTab } from "types/multileg/multileg";

////

export const pesquisarAtivoMultilegAPIAction = (
  tabIndex: number
): MainThunkAction => {
  return async (dispatch, getState) => {
    const {
      telaPrincipalReducer: { token },
      multilegReducer: {
        eventSourceCotacao,
        setIntervalCotacoesMultileg,
        multileg,
        cotacoesMultileg,
      },
    } = getState();

    dispatch(
      modificarVariavelMultileg({ nome: "pesquisandoAtivo", valor: true })
    );
    const data = await pesquisaAtivo({
      multilegTabs: multileg,
      tabIndex,
      multilegQuotes: cotacoesMultileg,
    });
    dispatch({
      type: PESQUISAR_ATIVO_MULTILEG_API,
      payload: data.multilegTabs,
    });

    dispatch(
      modificarVariavelMultileg({
        nome: "cotacoesMultileg",
        valor: data.multilegQuotes,
      })
    );
    atualizarCotacaoMultilegAction({
      dispatch,
      cotacoesMultileg: data.multilegQuotes,
      eventSourceCotacao,
      token,
      setIntervalCotacoesMultileg,
    });
    dispatch(
      modificarVariavelMultileg({ nome: "pesquisandoAtivo", valor: false })
    );
  };
};

interface searchSymbolData {
  multilegTabs: MultilegTab[];
  tabIndex: number;
  multilegQuotes: MultilegQuote[];
}

export const pesquisaAtivo = async ({
  multilegQuotes,
  multilegTabs,
  tabIndex,
}: searchSymbolData) => {
  let updatedMultilegTabs = [...multilegTabs];
  let multilegTab = multilegTabs[tabIndex];
  const symbol = multilegTab.ativo;

  const data = await pesquisarAtivoMultilegAPI(symbol);

  if (data) {
    adicionaCotacoesMultileg(multilegQuotes, symbol, data.cotacaoAtual);
    const symbolIsOption = symbol !== data.ativoPrincipal ? true : false;

    multilegTab.opcoes = [...data.opcoes].sort((a, b) => a.strike - b.strike);
    multilegTab.vencimento = [...data.vencimentos];
    multilegTab.variacao = data.variacao;
    multilegTab.vencimentoSelecionado = multilegTab.opcoes[0].expiration;
    multilegTab.strikeSelecionado = encontrarNumMaisProximo(
      data.opcoes,
      data.cotacaoAtual,
      symbol,
      symbolIsOption
    );
    multilegTab.ativoAtual = data.ativoPrincipal;
  }

  return { multilegTabs: updatedMultilegTabs, multilegQuotes };
};

export const enviarOrdemMultilegAction = (
  tabIndex: number
): MainThunkAction => {
  return async (dispatch, getState) => {
    const {
      multilegReducer: { multileg },
      telaPrincipalReducer: { contaSelecionada, token },
    } = getState();

    const mountOrderProps = {
      multilegTabs: multileg,
      selectedAccount: contaSelecionada,
      tabIndex,
    };

    const multilegRequestData = montarOrdemMultileg(mountOrderProps);

    travarDestravarClique("travar", "multileg");

    if (validarOrdemMultileg(mountOrderProps))
      await enviarOrdemAPI(multilegRequestData, token);

    travarDestravarClique("destravar", "multileg");
  };
};

export const criarAlertaMultilegAction = (
  tabIndex: number
): MainThunkAction => {
  return async (dispatch, getState) => {
    const {
      multilegReducer: { multileg },
      telaPrincipalReducer: { contaSelecionada },
    } = getState();

    const mountOrderProps = {
      multilegTabs: multileg,
      selectedAccount: contaSelecionada,
      tabIndex,
    };

    const multilegRequestData = montarOrdemMultileg(mountOrderProps);

    travarDestravarClique("travar", "multileg");
    if (validarOrdemMultileg(mountOrderProps))
      await criarAlertaOperacaoAPI(multilegRequestData);
    travarDestravarClique("destravar", "multileg");
  };
};

export const criarPosicaoMultilegAction = (
  tabIndex: number
): MainThunkAction => {
  return async (dispatch, getState) => {
    const {
      multilegReducer: { multileg },
      telaPrincipalReducer: { contaSelecionada },
    } = getState();

    const mountOrderProps = {
      multilegTabs: multileg,
      selectedAccount: contaSelecionada,
      tabIndex,
    };

    const multilegRequestData = montarOrdemMultileg(mountOrderProps);

    travarDestravarClique("travar", "multileg");
    if (validarOrdemMultileg(mountOrderProps))
      await criarPosicaoMultilegAPI(multilegRequestData);
    travarDestravarClique("destravar", "multileg");
  };
};
