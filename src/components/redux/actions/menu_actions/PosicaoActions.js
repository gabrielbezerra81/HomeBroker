import { MUDAR_VARIAVEL_POSICAO_CUSTODIA } from "constants/MenuActionTypes";
import { listarPosicoesAPI } from "components/api/API";

export const mudarVariavelPosicaoAction = (nome, valor) => {
  return dispatch => {
    dispatch({
      type: MUDAR_VARIAVEL_POSICAO_CUSTODIA,
      payload: { nome, valor }
    });
  };
};

export const listarPosicoesAction = () => {
  return async dispatch => {
    const dados = await listarPosicoesAPI();
    var listaPosicoes = [];
    dados.forEach(itemLista => {
      let posicao = {
        ativo: itemLista.stock.symbol,
        precoCompra: 0,
        precoVenda: 0,
        cotacaoAtual: 0,
        oscilacao: 0,
        stopLoss: itemLista.stopLoss || 0,
        stopGain: itemLista.stopGain || 0,
        total: itemLista.total,
        variacaoGanho: 0,
        qtde: itemLista.qtty,
        preco: itemLista.price,
        custodiaCompra: [],
        custodiaVenda: [],
        executando: []
      };

      listaPosicoes.push(posicao);
    });
    dispatch({
      type: MUDAR_VARIAVEL_POSICAO_CUSTODIA,
      payload: { nome: "posicoesCustodia", valor: listaPosicoes }
    });
  };
};
