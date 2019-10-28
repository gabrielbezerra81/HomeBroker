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
    dados.forEach(grupoPosicao => {
      grupoPosicao.operacoes.forEach(operacao => {
        let variacaoGanho = 0;
        if (operacao.dealPrice)
          variacaoGanho =
            ((Number(operacao.lastPrice) - Number(operacao.dealPrice)) /
              Number(operacao.dealPrice)) *
            100;
        let posicao = {
          ativo: operacao.ativos,
          precoCompra: operacao.priceMin,
          precoVenda: operacao.priceMax,
          cotacaoAtual: operacao.lastPrice,
          oscilacao: operacao.dealPrice || 0,
          stopLoss: operacao.stopLoss || 0,
          stopGain: operacao.stopGain || 0,
          total: Number(operacao.lastPrice) - Number(operacao.dealPrice), //itemLista.total,
          variacaoGanho: variacaoGanho,
          qtde: 0, // itemLista.qtty,
          preco: 0, //itemLista.price,
          custodiaCompra: [],
          custodiaVenda: [],
          executando: []
        };
        operacao.ordersWorking.forEach(ordem => {
          ordem.offers.forEach(oferta => {
            posicao.executando.push(oferta);
            if (oferta.oferta === "C") posicao.custodiaCompra.push(oferta);
            else posicao.custodiaVenda.push(oferta);
          });
        });

        listaPosicoes.push(posicao);
      });
    });
    dispatch({
      type: MUDAR_VARIAVEL_POSICAO_CUSTODIA,
      payload: { nome: "posicoesCustodia", valor: listaPosicoes }
    });
  };
};
