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
import { getReducerStateStorePrincipal } from "hooks/utils";

////

export const pesquisarAtivoMultilegAPIAction = (props, indice) => {
  return async (dispatch, getState) => {
    const { token } = getReducerStateStorePrincipal(getState(), "principal");
    const {
      eventSourceCotacao,
      setIntervalCotacoesMultileg,
    } = getReducerStateStorePrincipal(getState(), "multileg");

    dispatch(
      modificarVariavelMultileg({ nome: "pesquisandoAtivo", valor: true })
    );
    const dados = await pesquisaAtivo(
      props.multileg,
      indice,
      props.cotacoesMultileg
    );
    dispatch({ type: PESQUISAR_ATIVO_MULTILEG_API, payload: dados.multileg });
    dispatch(
      modificarVariavelMultileg({
        nome: "cotacoesMultileg",
        valor: dados.cotacoesMultileg,
      })
    );
    atualizarCotacaoMultilegAction({
      dispatch,
      cotacoesMultileg: dados.cotacoesMultileg,
      eventSourceCotacao,
      token,
      setIntervalCotacoesMultileg,
    });
    dispatch(
      modificarVariavelMultileg({ nome: "pesquisandoAtivo", valor: false })
    );
  };
};

export const pesquisaAtivo = async (abasMultileg, indice, cotacoesMultileg) => {
  let multileg = [...abasMultileg];
  let aba = multileg[indice];
  const codigo_ativo = aba.ativo;

  const dados = await pesquisarAtivoMultilegAPI(codigo_ativo);

  if (dados) {
    const cotacaoAtual = dados.cotacaoAtual;

    adicionaCotacoesMultileg(cotacoesMultileg, codigo_ativo, cotacaoAtual);
    const AtivoOpcao = codigo_ativo !== dados.ativoPrincipal ? true : false;

    aba.opcoes = [...dados.opcoes].sort((a, b) => a.strike - b.strike);
    aba.vencimento = [...dados.vencimentos];
    aba.valor = cotacaoAtual;
    aba.variacao = dados.variacao;
    aba.vencimentoSelecionado = aba.opcoes[0].expiration;
    aba.strikeSelecionado = encontrarNumMaisProximo(
      dados.opcoes,
      dados.cotacaoAtual,
      codigo_ativo,
      AtivoOpcao
    );
    aba.ativoAtual = dados.ativoPrincipal;
  }

  return { multileg, cotacoesMultileg };
};

////

export const enviarOrdemMultilegAction = (props) => {
  return async (dispatch) => {
    let json = montarOrdemMultileg(props);
    travarDestravarClique("travar", "multileg");

    if (validarOrdemMultileg(props)) await enviarOrdemAPI([json], props.token);

    travarDestravarClique("destravar", "multileg");
  };
};

export const criarAlertaMultilegAction = (props) => {
  return async (dispatch) => {
    let json = montarOrdemMultileg(props);
    travarDestravarClique("travar", "multileg");
    if (validarOrdemMultileg(props)) await criarAlertaOperacaoAPI([json]);
    travarDestravarClique("destravar", "multileg");
  };
};

export const criarPosicaoMultilegAction = (props) => {
  return async (dispatch) => {
    let json = montarOrdemMultileg(props);
    travarDestravarClique("travar", "multileg");
    if (validarOrdemMultileg(props)) await criarPosicaoMultilegAPI([json]);
    travarDestravarClique("destravar", "multileg");
  };
};
