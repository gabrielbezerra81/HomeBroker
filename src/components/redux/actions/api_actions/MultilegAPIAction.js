import { useSelector } from "react-redux";
import {
  pesquisarAtivoMultilegAPI,
  pesquisarStrikesMultilegAPI,
  enviarOrdemAPI,
  travarDestravarClique,
  verificarMonitorarAtivoAPI,
  criarAlertaOperacaoAPI,
  criarPosicaoMultilegAPI,
} from "components/api/API";
import { PESQUISAR_ATIVO_MULTILEG_API } from "constants/ApiActionTypes";
import {
  montarOrdemMultileg,
  validarOrdemMultileg,
  atualizarCotacaoAction,
  adicionaCotacoesMultileg,
} from "components/redux/actions/menu_actions/MultilegActions";
import { MODIFICAR_VARIAVEL_MULTILEG } from "constants/MenuActionTypes";

////

export const pesquisarAtivoMultilegAction = (props, indice) => {
  return async (dispatch) => {
    travarDestravarClique("travar", "multileg");
    const dados = await pesquisaAtivo(
      props.multileg,
      indice,
      props.cotacoesMultileg
    );
    dispatch({ type: PESQUISAR_ATIVO_MULTILEG_API, payload: dados.multileg });
    dispatch({
      type: MODIFICAR_VARIAVEL_MULTILEG,
      payload: { nome: "cotacoesMultileg", valor: dados.cotacoesMultileg },
    });
    atualizarCotacaoAction(dispatch, props, dados.cotacoesMultileg);
    travarDestravarClique("destravar", "multileg");
  };
};

export const pesquisaAtivo = async (abasMultileg, indice, cotacoesMultileg) => {
  let multileg = [...abasMultileg];
  let aba = multileg[indice];
  const codigo_ativo = aba.ativo;

  verificarMonitorarAtivoAPI(codigo_ativo);

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

export const pesquisarStrikesMultilegAction = async (
  codigo_ativo,
  vencimento
) => {
  travarDestravarClique("travar", "multileg");
  const dados = await pesquisarStrikesMultilegAPI(codigo_ativo, vencimento);
  travarDestravarClique("destravar", "multileg");
  if (dados) {
    return dados;
  }
  return async (dispatch) => {
    dispatch({ type: "" });
  };
};

export const encontrarNumMaisProximo = (
  listaOpcoes,
  cotacao,
  codigo_ativo,
  opcaoBool
) => {
  if (listaOpcoes.length > 0) {
    if (opcaoBool) {
      const opcao = listaOpcoes.filter(
        (opcao) => opcao.symbol === codigo_ativo
      );
      return opcao[0].strike;
    } else {
      var maisProximo = listaOpcoes.reduce((prev, curr) =>
        Math.abs(curr.strike - cotacao) < Math.abs(prev.strike - cotacao)
          ? curr
          : prev
      );
      return maisProximo.strike;
    }
  }
};

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
