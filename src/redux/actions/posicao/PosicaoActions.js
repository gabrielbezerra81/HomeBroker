import { listarPosicoesAPI, pesquisarAtivoAPI } from "api/API";
import {
  atualizarEmblemasAPI,
  atualizarPosicaoAPI,
  atualizarCotacaoPosicaoAPI,
} from "api/ReativosAPI";
import { updateOnePositionState, adicionaPosicao } from "./utils";
import { getReducerStateStorePrincipal } from "hooks/utils";

export const mudarVariavelPosicaoAction = (attributeName, attributeValue) => {
  return (dispatch) => {
    dispatch(updateOnePositionState({ attributeName, attributeValue }));
  };
};

export const listarPosicoesAction = (props) => {
  return async (dispatch, getState) => {
    const { token } = getReducerStateStorePrincipal(getState(), "principal");
    const {
      eventSourcePosicao,
      eventSourceEmblema,
      setIntervalEmblema,
      eventSourceCotacoes,
      setIntervalCotacoesPosicao,
    } = getReducerStateStorePrincipal(getState(), "posicao");

    if (token) {
      const dados = await listarPosicoesAPI(token);

      const listaPosicoes = [];
      const arrayPrecos = [];
      let arrayCotacoes = [];

      // dados.forEach((grupoPosicao) => {
      //   const posicao = adicionaPosicao(grupoPosicao);
      //   const preco = {
      //     precoCompra: posicao[0].precoCompra,
      //     precoVenda: posicao[0].precoVenda,
      //     cotacaoAtual: posicao[0].cotacaoAtual,
      //     idEstrutura: posicao[0].idEstrutura,
      //   };
      //   arrayPrecos.push(preco);
      //   listaPosicoes.push(...posicao);
      // });
      // // listaPosicoes.splice(0, 19);
      // // arrayPrecos.splice(0, 19);
      // arrayCotacoes = await montaArrayCotacoes(listaPosicoes);

      // atualizarPosicao({
      //   dispatch,
      //   listaPosicoes,
      //   token,
      //   eventSourcePosicao,
      // });
      // atualizarEmblemas({
      //   dispatch,
      //   token,
      //   listaPosicoes,
      //   listaPrecos: arrayPrecos,
      //   eventSourceEmblema,
      //   setIntervalEmblema,
      // });
      // atualizarCotacoes({
      //   dispatch,
      //   listaPosicoes,
      //   arrayCotacoes,
      //   eventSourceCotacoes,
      //   setIntervalCotacoesPosicao,
      //   token,
      // });

      dispatch(
        updateOnePositionState({
          attributeName: "posicoesCustodia",
          attributeValue: listaPosicoes,
        })
      );
      dispatch(
        updateOnePositionState({
          attributeName: "arrayPrecos",
          attributeValue: arrayPrecos,
        })
      );
      dispatch(
        updateOnePositionState({
          attributeName: "arrayCotacoes",
          attributeValue: arrayCotacoes,
        })
      );
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

  dispatch(
    updateOnePositionState({
      attributeName: "eventSourcePosicao",
      attributeValue: newSource,
    })
  );
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

export const atualizarEmblemasAction = () => {
  return (dispatch, getState) => {
    const { token } = getReducerStateStorePrincipal(getState(), "principal");
    const {
      eventSourceEmblema,
      setIntervalEmblema,
      arrayPrecos,
      posicoesCustodia,
    } = getReducerStateStorePrincipal(getState(), "posicao");

    atualizarEmblemas({
      dispatch,
      listaPrecos: arrayPrecos,
      listaPosicoes: posicoesCustodia,
      token,
      eventSourceEmblema,
      setIntervalEmblema,
    });
  };
};

const atualizarEmblemas = ({
  dispatch,
  listaPosicoes,
  eventSourceEmblema,
  listaPrecos,
  setIntervalEmblema,
  token,
}) => {
  let ids = "";

  if (eventSourceEmblema) {
    eventSourceEmblema.close();
  }
  if (setIntervalEmblema) {
    clearInterval(setIntervalEmblema);
  }

  listaPosicoes.forEach((posicao) => {
    ids += posicao.idEstrutura + ",";
  });
  ids = ids.substring(0, ids.length - 1);

  const newSource = atualizarEmblemasAPI({
    dispatch,
    ids,
    listaPrecos,
    token,
  });

  dispatch(
    updateOnePositionState({
      attributeName: "eventSourceEmblema",
      attributeValue: newSource,
    })
  );
};

export const atualizarCotacoesPosicaoAction = () => {
  return (dispatch, getState) => {
    const { token } = getReducerStateStorePrincipal(getState(), "principal");
    const {
      eventSourceCotacoes,
      setIntervalCotacoesPosicao,
      posicoesCustodia,
      arrayCotacoes,
    } = getReducerStateStorePrincipal(getState(), "posicao");

    atualizarCotacoes({
      dispatch,
      arrayCotacoes,
      listaPosicoes: posicoesCustodia,
      eventSourceCotacoes,
      setIntervalCotacoesPosicao,
      token,
    });
  };
};

const atualizarCotacoes = async ({
  dispatch,
  listaPosicoes,
  arrayCotacoes,
  token,
  eventSourceCotacoes,
  setIntervalCotacoesPosicao,
}) => {
  let codigos = "";
  const arrayCodigos = await montaArrayCotacoes(listaPosicoes, "codigos");

  if (eventSourceCotacoes) {
    eventSourceCotacoes.close();
  }
  if (setIntervalCotacoesPosicao) {
    // quem disparar pela segunda vez deve ter essa var no connect
    clearInterval(setIntervalCotacoesPosicao);
  }

  arrayCodigos.forEach((ativo) => {
    codigos += ativo.codigo + ",";
  });

  codigos = codigos.substring(0, codigos.length - 1);

  const newSource = atualizarCotacaoPosicaoAPI({
    dispatch,
    arrayCotacoes,
    codigos,
    token,
  });

  dispatch(
    updateOnePositionState({
      attributeName: "eventSourceCotacoes",
      attributeValue: newSource,
    })
  );
};
