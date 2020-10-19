import { listarPosicoesAPI } from "api/API";
import { url_pesquisarAtivoBoletas_codigo } from "api/url";
import {
  atualizarEmblemasAPI,
  atualizarPosicaoAPI,
  atualizarCotacaoPosicaoAPI,
} from "api/ReativosAPI";
import {
  updateOnePositionState,
  adicionaPosicao,
  updateManyPositionState,
} from "./utils";
import { getReducerStateStorePrincipal } from "hooks/utils";
import api from "api/apiConfig";

export const mudarVariavelPosicaoAction = (attributeName, attributeValue) => {
  return (dispatch) => {
    dispatch(updateOnePositionState({ attributeName, attributeValue }));
  };
};

export const listarPosicoesAction = (props) => {
  return async (dispatch, getState) => {
    const { token, isOpenPosition } = getReducerStateStorePrincipal(
      getState(),
      "principal",
    );

    const {
      eventSourcePosicao,
      eventSourceEmblema,
      setIntervalEmblema,
      eventSourceCotacoes,
      setIntervalCotacoesPosicao,
    } = getReducerStateStorePrincipal(getState(), "posicao");

    if (token) {
      const dados = await listarPosicoesAPI();

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

      if (isOpenPosition) {
        atualizarEmblemas({
          dispatch,
          token,
          listaPosicoes,
          listaPrecos: arrayPrecos,
          eventSourceEmblema,
          setIntervalEmblema,
        });
        atualizarCotacoes({
          dispatch,
          listaPosicoes,
          arrayCotacoes,
          eventSourceCotacoes,
          setIntervalCotacoesPosicao,
          token,
        });
      }

      dispatch(
        updateManyPositionState({
          posicoesCustodia: listaPosicoes,
          arrayPrecos,
          arrayCotacoes,
        }),
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
  if (eventSourcePosicao && eventSourcePosicao.close) {
    eventSourcePosicao.close();
  }

  const newSource = atualizarPosicaoAPI({ dispatch, listaPosicoes, token });

  dispatch(
    updateOnePositionState({
      attributeName: "eventSourcePosicao",
      attributeValue: newSource,
    }),
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

    const response = await api.get(
      `${url_pesquisarAtivoBoletas_codigo}${ativo.codigo}`,
    );

    if (response.data) {
      ativo.cotacao = response.data.ultimo;
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
  let idArray = [];

  if (eventSourceEmblema && eventSourceEmblema.close) {
    eventSourceEmblema.close();
  }
  if (setIntervalEmblema) {
    clearInterval(setIntervalEmblema);
  }

  listaPosicoes.forEach((posicao) => {
    idArray.push(posicao.idEstrutura);
  });
  const ids = idArray.join(",");

  if (ids) {
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
      }),
    );
  }
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
  const arrayCodigos = await montaArrayCotacoes(listaPosicoes, "codigos");

  if (eventSourceCotacoes && eventSourceCotacoes.close) {
    eventSourceCotacoes.close();
  }
  if (setIntervalCotacoesPosicao) {
    // quem disparar pela segunda vez deve ter essa var no connect
    clearInterval(setIntervalCotacoesPosicao);
  }

  const codigos = arrayCodigos.join(",");

  if (codigos) {
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
      }),
    );
  }
};
