import {
  pesquisarAtivoMultilegAPI,
  pesquisarStrikesMultilegAPI
} from "components/api/API";
import { PESQUISAR_ATIVO_MULTILEG_API } from "constants/ApiActionTypes";

export const pesquisarAtivoMultilegAction = (props, indice) => {
  return async dispatch => {
    let multileg = [...props.multileg];
    const codigo_ativo = multileg[indice].ativo;

    const dados = await pesquisarAtivoMultilegAPI(codigo_ativo);
    if (dados) {
      multileg[indice].opcoes = [...dados.opcoes];
      multileg[indice].vencimento = [...dados.vencimentos];
      multileg[indice].valor = dados.cotacaoAtual;
      multileg[indice].variacao = dados.variacao;
      multileg[indice].vencimentoSelecionado = dados.vencimentos[0];
      multileg[indice].strikeSelecionado = encontrarNumMaisProximo(
        dados.opcoes,
        dados.cotacaoAtual
      );
      dispatch({ type: PESQUISAR_ATIVO_MULTILEG_API, payload: multileg });
    }
  };
};

export const pesquisarStrikesMultilegAction = async (multileg, indice) => {
  const codigo_ativo = multileg[indice].ativo;
  const vencimento = multileg[indice].vencimentoSelecionado;
  const dados = await pesquisarStrikesMultilegAPI(codigo_ativo, vencimento);
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
