import { listarPosicoesAPI, pesquisarAtivoAPI } from "api/API";
import {
  atualizarEmblemasAPI,
  atualizarPosicaoAPI,
  atualizarCotacaoAPI,
} from "api/ReativosAPI";
import { mudarVariavelPosicao, adicionaPosicao } from "./utils";
import { getReducerStateStorePrincipal } from "hooks/utils";

export const mudarVariavelPosicaoAction = (nome, valor) => {
  return (dispatch) => {
    dispatch(mudarVariavelPosicao({ nome, valor }));
  };
};

export const listarPosicoesAction = (props) => {
  return async (dispatch, getState) => {
    const { token } = getReducerStateStorePrincipal(getState(), "principal");
    const { eventSourcePosicao } = getReducerStateStorePrincipal(
      getState(),
      "posicao"
    );

    if (token) {
      const dados = await listarPosicoesAPI(token);

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

      atualizarPosicao({
        dispatch,
        listaPosicoes,
        token,
        eventSourcePosicao,
      });
      atualizarEmblemas(dispatch, listaPosicoes, props, arrayPrecos);
      atualizarCotacoes(dispatch, listaPosicoes, props, arrayCotacoes);

      dispatch(mudarVariavelPosicaoAction("posicoesCustodia", listaPosicoes));
      dispatch(mudarVariavelPosicaoAction("arrayPrecos", arrayPrecos));
      dispatch(mudarVariavelPosicaoAction("arrayCotacoes", arrayCotacoes));
    }
  };
};

const atualizarPosicao = async ({
  dispatch,
  listaPosicoes,
  eventSourcePosicao,
  token,
}) => {
  if (eventSourcePosicao) {
    eventSourcePosicao.close();
  }

  const newSource = atualizarPosicaoAPI({ dispatch, listaPosicoes, token });

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
