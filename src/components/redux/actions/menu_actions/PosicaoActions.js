import { MUDAR_VARIAVEL_POSICAO_CUSTODIA } from "constants/MenuActionTypes";
import {
  listarPosicoesAPI,
  atualizarEmblemasAPI,
  atualizarPosicaoAPI
} from "components/api/API";

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
    const dados = await listarPosicoesAPI();
    var listaPosicoes = [];
    dados.forEach(grupoPosicao => {
      const posicao = adicionaPosicao(grupoPosicao);
      listaPosicoes.push(...posicao);
    });
    
    //listaPosicoes.splice(0, 27);

    atualizarPosicao(dispatch, listaPosicoes, props, 1);
    atualizarEmblemas(dispatch, listaPosicoes, props);

    dispatch({
      type: MUDAR_VARIAVEL_POSICAO_CUSTODIA,
      payload: { nome: "posicoesCustodia", valor: listaPosicoes }
    });
  };
};

export const adicionaPosicao = grupoPosicao => {
  return grupoPosicao.operacoes.map(operacao => {
    let variacaoGanho = 0;
    if (operacao.dealPrice)
      variacaoGanho =
        ((Number(operacao.lastPrice) - Number(operacao.dealPrice)) /
          Number(operacao.dealPrice)) *
        100;
    var posicao = {
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
      idEstrutura: operacao.structureId,
      agrupadorPrincipal: grupoPosicao.agrupadorPrincipal
    };
    if (operacao.ordersWorking.length === 0) {
      posicao.total = 0;
    }
    posicao.executando = [...operacao.ordersWorking];
    operacao.ordersWorking.forEach(ordem => {
      ordem.offers.forEach(oferta => {
        if (oferta.qtdeExecutada === 0) {
          posicao.total = 0;
        }

        if (oferta.oferta === "C") posicao.custodiaCompra.push(oferta);
        else posicao.custodiaVenda.push(oferta);
      });
    });

    return posicao;
  });
};

export const atualizarEmblemasAction = props => {
  return dispatch => {
    atualizarEmblemas(dispatch, props.posicoesCustodia, props);
  };
};

const atualizarEmblemas = (dispatch, listaPosicoes, props) => {
  let ids = "";

  if (props.eventSourceEmblema) {
    props.eventSourceEmblema.close();
  }

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

export const atualizarPosicaoAction = props => {
  return dispatch => {
    atualizarPosicao(dispatch, props.posicoesCustodia, props, 1);
  };
};

const atualizarPosicao = (dispatch, listaPosicoes, props, idUsuario) => {
  if (props.eventSourcePosicao) {
    props.eventSourcePosicao.close();
  }

  const newSource = atualizarPosicaoAPI(dispatch, listaPosicoes, idUsuario);

  dispatch({
    type: MUDAR_VARIAVEL_POSICAO_CUSTODIA,
    payload: { nome: "eventSourcePosicao", valor: newSource }
  });
};
