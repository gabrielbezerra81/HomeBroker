import { MUDAR_VARIAVEL_POSICAO_CUSTODIA } from "constants/MenuActionTypes";
import { listarPosicoesAPI, atualizarEmblemasAPI } from "components/api/API";

export const mudarVariavelPosicaoAction = (nome, valor) => {
  return dispatch => {
    dispatch({
      type: MUDAR_VARIAVEL_POSICAO_CUSTODIA,
      payload: { nome, valor }
    });
  };
};

export const listarPosicoesAction = props => {
  return async dispatch => {
    if (props.eventSourceEmblema) {
      props.eventSourceEmblema.close();
    }
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
          ativos: operacao.ativos,
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
          executando: [],
          idEstrutura: operacao.structureId
        };
        if (!operacao.ordersWorking) {
          posicao.total = 0;
        }
        operacao.ordersWorking.forEach(ordem => {
          ordem.offers.forEach(oferta => {
            if (oferta.qtdeExecutada === 0) {
              posicao.total = 0;
            }
            posicao.executando.push(oferta);
            if (oferta.oferta === "C") posicao.custodiaCompra.push(oferta);
            else posicao.custodiaVenda.push(oferta);
          });
        });

        listaPosicoes.push(posicao);
      });
    });
    atualizarEmblemasAction(dispatch, listaPosicoes);
    dispatch({
      type: MUDAR_VARIAVEL_POSICAO_CUSTODIA,
      payload: { nome: "posicoesCustodia", valor: listaPosicoes }
    });
  };
};

const atualizarEmblemasAction = (dispatch, listaPosicoes) => {
  let ids = "";

  listaPosicoes.forEach(posicao => {
    ids += posicao.idEstrutura + ",";
  });
  ids = ids.substring(0, ids.length - 1);

  const newSource = atualizarEmblemasAPI(dispatch, listaPosicoes, ids);

  dispatch({
    type: MUDAR_VARIAVEL_POSICAO_CUSTODIA,
    payload: { nome: "eventSourceEmblema", valor: newSource }
  });
};
