import {
  pesquisarAtivoMultilegAPI,
  pesquisarStrikesMultilegAPI
} from "components/api/API";
import { PESQUISAR_ATIVO_MULTILEG_API } from "constants/ApiActionTypes";

export const pesquisarAtivoMultilegAction = (props, indice) => {
  return async dispatch => {
    let multileg = [...props.multileg];
    let aba = multileg[indice];
    const codigo_ativo = aba.ativo;

    document.body.style.cursor = "wait";
    const dados = await pesquisarAtivoMultilegAPI(codigo_ativo);
    document.body.style.cursor = "auto";
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
    }
  };
};

export const pesquisarStrikesMultilegAction = async (
  codigo_ativo,
  vencimento
) => {
  document.body.style.cursor = "wait";
  const dados = await pesquisarStrikesMultilegAPI(codigo_ativo, vencimento);
  document.body.style.cursor = "auto";
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
