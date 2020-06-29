import { MUDAR_VARIAVEL_POSICAO_CUSTODIA } from "constants/MenuActionTypes";
import { listarPosicoesAPI, pesquisarAtivoAPI } from "components/api/API";
import {
  atualizarEmblemasAPI,
  atualizarPosicaoAPI,
  atualizarCotacaoAPI,
} from "components/api/ReativosAPI";
import ItemPosicao from "entities/posicao/posicao";

export const mudarVariavelPosicaoAction = (nome, valor) => {
  return (dispatch) => {
    dispatch({
      type: MUDAR_VARIAVEL_POSICAO_CUSTODIA,
      payload: { nome, valor },
    });
  };
};

export const listarPosicoesAction = (props) => {
  return async (dispatch) => {
    if (props.token) {
      const dados = await listarPosicoesAPI(props.token);

      const listaPosicoes = [];
      const arrayPrecos = [];
      let arrayCotacoes = [];

      dados.forEach((grupoPosicao) => {
        const posicao = adicionaPosicao(grupoPosicao);
        const preco = {
          precoCompra: posicao[0].precoCompra,
          precoVenda: posicao[0].precoVenda,
          cotacaoAtual: posicao[0].cotacaoAtual,
          idEstrutura: posicao[0].idEstrutura,
        };
        arrayPrecos.push(preco);
        listaPosicoes.push(...posicao);
      });
      // listaPosicoes.splice(0, 19);
      // arrayPrecos.splice(0, 19);
      arrayCotacoes = await montaArrayCotacoes(listaPosicoes);

      atualizarPosicao(dispatch, listaPosicoes, props, props.token.accessToken);
      atualizarEmblemas(dispatch, listaPosicoes, props, arrayPrecos);
      atualizarCotacoes(dispatch, listaPosicoes, props, arrayCotacoes);

      dispatch(mudarVariavelPosicaoAction("posicoesCustodia", listaPosicoes));
      dispatch(mudarVariavelPosicaoAction("arrayPrecos", arrayPrecos));
      dispatch(mudarVariavelPosicaoAction("arrayCotacoes", arrayCotacoes));
    }
  };
};

export const adicionaPosicao = (grupoPosicao) => {
  return grupoPosicao.operacoes.map((operacao) => {
    let variacaoGanho = 0;
    if (operacao.dealPrice)
      variacaoGanho =
        ((Number(operacao.lastPrice) - Number(operacao.dealPrice)) /
          Number(operacao.dealPrice)) *
        100;
    var posicao = {
      ativos: operacao.ativos, // TODO: atualização reativa vem elemento sem atributo ativos
      precoCompra: operacao.priceMin,
      precoVenda: operacao.priceMax,
      cotacaoAtual: operacao.lastPrice,
      oscilacao: operacao.dealPrice,
      stopLoss: operacao.stopLoss,
      stopGain: operacao.stopGain,
      total: Number(operacao.lastPrice) - Number(operacao.dealPrice), //itemLista.total,
      variacaoGanho: variacaoGanho,
      qtde: 0, // itemLista.qtty,
      preco: 0, //itemLista.price,
      custodiaCompra: [],
      custodiaVenda: [],
      executando: [],
      idEstrutura: operacao.structureId,
      agrupadorPrincipal: grupoPosicao.agrupadorPrincipal,
    };
    if (operacao.ordersWorking.length === 0) {
      posicao.total = 0;
    }
    posicao.executando = [...operacao.ordersWorking];
    operacao.ordersWorking.forEach((ordem) => {
      ordem.offers.forEach((oferta) => {
        if (oferta.qtdeExecutada === 0) {
          posicao.total = 0;
        }

        if (oferta.oferta === "C") posicao.custodiaCompra.push(oferta);
        else posicao.custodiaVenda.push(oferta);
      });
    });

    const itemPosicao = new ItemPosicao(posicao);

    return itemPosicao;
  });
};

const atualizarPosicao = async (dispatch, listaPosicoes, props, token) => {
  if (props.eventSourcePosicao) {
    props.eventSourcePosicao.close();
  }

  const newSource = atualizarPosicaoAPI(dispatch, listaPosicoes, token);

  dispatch(mudarVariavelPosicaoAction("eventSourcePosicao", newSource));
};

const montaArrayCotacoes = async (listaPosicoes, tipoRetorno = "completo") => {
  let arrayCodigos = [];
  listaPosicoes.forEach((posicao) => {
    posicao.ativos.forEach((ativo) => {
      if (!arrayCodigos.some((item) => item.codigo === ativo.symbol)) {
        arrayCodigos.push({ codigo: ativo.symbol });
      }
    });
  });
  if (tipoRetorno === "codigos") return arrayCodigos;

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

export const atualizarEmblemasAction = (props) => {
  return (dispatch) => {
    const { posicoesCustodia, arrayPrecos } = props;
    atualizarEmblemas(dispatch, posicoesCustodia, props, arrayPrecos);
  };
};

const atualizarEmblemas = (dispatch, listaPosicoes, props, arrayPrecos) => {
  let ids = "";

  if (props.eventSourceEmblema) {
    props.eventSourceEmblema.close();
  }
  if (props.setIntervalEmblema) {
    clearInterval(props.setIntervalEmblema);
  }

  listaPosicoes.forEach((posicao) => {
    ids += posicao.idEstrutura + ",";
  });
  ids = ids.substring(0, ids.length - 1);

  const newSource = atualizarEmblemasAPI(dispatch, arrayPrecos, ids);

  dispatch(mudarVariavelPosicaoAction("eventSourceEmblema", newSource));
};

export const atualizarCotacoesAction = (props) => {
  return (dispatch) => {
    const { posicoesCustodia, arrayCotacoes } = props;
    atualizarCotacoes(dispatch, posicoesCustodia, props, arrayCotacoes);
  };
};

const atualizarCotacoes = async (
  dispatch,
  listaPosicoes,
  props,
  arrayCotacoes
) => {
  let codigos = "";
  const arrayCodigos = await montaArrayCotacoes(listaPosicoes, "codigos");

  if (props.eventSourceCotacoes) {
    props.eventSourceCotacoes.close();
  }
  if (props.setIntervalCotacoesPosicao) {
    // quem disparar pela segunda vez deve ter essa var no connect
    clearInterval(props.setIntervalCotacoesPosicao);
  }

  arrayCodigos.forEach((ativo) => {
    codigos += ativo.codigo + ",";
  });

  codigos = codigos.substring(0, codigos.length - 1);

  const newSource = atualizarCotacaoAPI(
    dispatch,
    codigos,
    "posicao",
    arrayCotacoes
  );

  dispatch(mudarVariavelPosicaoAction("eventSourceCotacoes", newSource));
};
