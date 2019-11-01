import {
  pesquisarAtivoMultilegAPI,
  pesquisarStrikesMultilegAPI,
  enviarOrdemAPI,
  travarDestravarClique
} from "components/api/API";
import { PESQUISAR_ATIVO_MULTILEG_API } from "constants/ApiActionTypes";
import {
  atualizarCotacaoAction,
  montarOrdemMultileg,
  validarOrdemMultileg
} from "components/redux/actions/menu_actions/MultilegActions";

export const pesquisarAtivoMultilegAction = (props, indice) => {
  return async dispatch => {
    let multileg = [...props.multileg];
    let aba = multileg[indice];
    const codigo_ativo = aba.ativo;

    travarDestravarClique("travar", "multileg");
    const dados = await pesquisarAtivoMultilegAPI(codigo_ativo);
    travarDestravarClique("destravar", "multileg");
    if (dados) {
      aba.opcoes = [...dados.opcoes];
      aba.vencimento = [...dados.vencimentos];
      aba.valor = dados.cotacaoAtual;
      aba.variacao = dados.variacao;
      aba.vencimentoSelecionado = dados.vencimentos[0];
      aba.strikeSelecionado = encontrarNumMaisProximo(
        dados.opcoes,
        dados.cotacaoAtual
      );
      aba.ativoAtual = codigo_ativo;

      dispatch({ type: PESQUISAR_ATIVO_MULTILEG_API, payload: multileg });
      //atualizarCotacaoAction(dispatch, props, multileg);
    }
  };
};

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
  return async dispatch => {
    dispatch({ type: "" });
  };
};

export const encontrarNumMaisProximo = (listaOpcoes, cotacao) => {
  var maisProximo = listaOpcoes.reduce((prev, curr) =>
    Math.abs(curr.strike - cotacao) < Math.abs(prev.strike - cotacao)
      ? curr
      : prev
  );

  return maisProximo.strike;
};
export const desgraça = () => {
  return dispatch => {};
};

export const enviarOrdemMultilegAction = props => {
  return async dispatch => {
    let json = montarOrdemMultileg(props);

    if (validarOrdemMultileg(props)) enviarOrdemAPI([json]);
  };
};
