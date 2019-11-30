import { MUDAR_VARIAVEL_POSICAO_CUSTODIA } from "constants/MenuActionTypes";
import {
  listarPosicoesAPI,
  atualizarEmblemasAPI,
  atualizarPosicaoAPI,
  pesquisarAtivoAPI
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
    var arrayPrecos = [];
    var arrayCotacoes = [];

    dados.forEach(grupoPosicao => {
      const posicao = adicionaPosicao(grupoPosicao);
      const preco = {
        precoCompra: posicao[0].precoCompra,
        precoVenda: posicao[0].precoVenda,
        cotacaoAtual: posicao[0].cotacaoAtual,
        idEstrutura: posicao[0].idEstrutura
      };
      arrayPrecos.push(preco);
      listaPosicoes.push(...posicao);
    });
    // listaPosicoes.splice(0, 19);
    // arrayPrecos.splice(0, 19);
    arrayCotacoes = await montaArrayCotacoes(listaPosicoes);

    atualizarPosicao(dispatch, listaPosicoes, props, 1);
    atualizarEmblemas(dispatch, listaPosicoes, props, arrayPrecos);

    dispatch({
      type: MUDAR_VARIAVEL_POSICAO_CUSTODIA,
      payload: { nome: "posicoesCustodia", valor: listaPosicoes }
    });
    dispatch({
      type: MUDAR_VARIAVEL_POSICAO_CUSTODIA,
      payload: { nome: "arrayPrecos", valor: arrayPrecos }
    });
    dispatch({
      type: MUDAR_VARIAVEL_POSICAO_CUSTODIA,
      payload: { nome: "arrayCotacoes", valor: arrayCotacoes }
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

// Atualiza min, max e ult
export const atualizarEmblemasAction = props => {
  return dispatch => {
    atualizarEmblemas(
      dispatch,
      props.posicoesCustodia,
      props,
      props.arrayPrecos
    );
  };
};

export const atualizarEmblemas = (
  dispatch,
  listaPosicoes,
  props,
  arrayPrecos
) => {
  let ids = "";

  if (props.eventSourceEmblema) {
    props.eventSourceEmblema.close();
  }

  listaPosicoes.forEach(posicao => {
    ids += posicao.idEstrutura + ",";
  });
  ids = ids.substring(0, ids.length - 1);

  const newSource = atualizarEmblemasAPI(dispatch, arrayPrecos, ids);

  dispatch({
    type: MUDAR_VARIAVEL_POSICAO_CUSTODIA,
    payload: { nome: "eventSourceEmblema", valor: newSource }
  });
};

// Atualiza demais campos de posição
export const atualizarPosicaoAction = props => {
  return dispatch => {
    atualizarPosicao(dispatch, props.posicoesCustodia, props, 1);
  };
};

const atualizarPosicao = (dispatch, listaPosicoes, props, idUsuario) => {
  if (props.eventSourcePosicao) {
    props.eventSourcePosicao.close();
  }

  const newSource = atualizarPosicaoAPI(
    dispatch,
    listaPosicoes,
    idUsuario,
    props
  );

  dispatch({
    type: MUDAR_VARIAVEL_POSICAO_CUSTODIA,
    payload: { nome: "eventSourcePosicao", valor: newSource }
  });
};

const montaArrayCotacoes = async listaPosicoes => {
  let arrayCodigos = [];
  listaPosicoes.forEach(posicao => {
    posicao.ativos.forEach(ativo => {
      if (!arrayCodigos.some(item => item.codigo === ativo.symbol)) {
        arrayCodigos.push({ codigo: ativo.symbol });
      }
    });
  });

  for (var [indice] in arrayCodigos) {
    const ativo = arrayCodigos[indice];
    const dadosAtivo = await pesquisarAtivoAPI(ativo.codigo);
    if (dadosAtivo) {
      const cotacao = dadosAtivo.cotacaoAtual;
      ativo.cotacao = cotacao;
    }
  }
  return arrayCodigos;
};
