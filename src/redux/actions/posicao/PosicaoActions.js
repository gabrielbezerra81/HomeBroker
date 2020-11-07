import { listarPosicoesAPI } from "api/API";
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
import api from "api/apiConfig";

export const mudarVariavelPosicaoAction = (attributeName, attributeValue) => {
  return (dispatch) => {
    dispatch(updateOnePositionState({ attributeName, attributeValue }));
  };
};

export const listPositionAction = () => {
  return async (dispatch, getState) => {
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

    dispatch(
      updateManyPositionState({
        posicoesCustodia: listaPosicoes,
        arrayPrecos,
        arrayCotacoes,
      }),
    );
  };
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

  const joinedSymbols = arrayCodigos.map((item) => item.codigo).join(",");

  // pesquisa em lote da cotação dos códigos da posição
  try {
    const response = await api.get(
      `price/quotes/symbols?symbols=${joinedSymbols}`,
    );

    if (response.data) {
      const symbolsDataArray = response.data;

      arrayCodigos.forEach((codeItem) => {
        const matchingSymbolIndex = symbolsDataArray.findIndex(
          (symbolData) => codeItem.codigo === symbolData.symbol,
        );

        if (matchingSymbolIndex !== -1) {
          codeItem.cotacao = symbolsDataArray[matchingSymbolIndex].ultimo || 0;
        } else {
          codeItem.cotacao = 0;
        }
      });
    }
  } catch (error) {
    arrayCodigos.forEach((codeItem) => {
      codeItem.cotacao = 0;
    });
  }

  return arrayCodigos;
};

// position
export const startReactivePositionUpdateAction = () => {
  return (dispatch, getState) => {
    const {
      positionReducer: {
        eventSourcePosicao: esource_position,
        posicoesCustodia: positionList,
      },
      systemReducer: { token },
    } = getState();

    if (esource_position && esource_position.close) {
      esource_position.close();
    }

    const source = atualizarPosicaoAPI({
      dispatch,
      listaPosicoes: positionList,
      token,
    });

    dispatch(
      updateOnePositionState({
        attributeName: "eventSourcePosicao",
        attributeValue: source,
      }),
    );
  };
};

// emblem
export const startReactiveEmblemUpdateAction = () => {
  return (dispatch, getState) => {
    const {
      positionReducer: {
        posicoesCustodia: positionList,
        eventSourceEmblema: esource_emblem,
        setIntervalEmblema: interval_emblem,
      },
      systemReducer: { token },
    } = getState();

    let idArray = [];

    if (esource_emblem && esource_emblem.close) {
      esource_emblem.close();
    }
    if (interval_emblem) {
      clearInterval(interval_emblem);
    }

    positionList.forEach((posicao) => {
      idArray.push(posicao.idEstrutura);
    });
    const ids = idArray.join(",");

    if (ids) {
      const newSource = atualizarEmblemasAPI({
        dispatch,
        ids,
        listaPrecos: positionList,
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
};

// quote
export const startReactivePositionQuoteUpdateAction = () => {
  return async (dispatch, getState) => {
    const {
      positionReducer: {
        posicoesCustodia: positionList,
        eventSourceCotacoes: esource_positionQuote,
        setIntervalCotacoesPosicao: interval_positionQuote,
        arrayCotacoes: positionQuotes,
      },
      systemReducer: { token },
    } = getState();

    const symbolList = await montaArrayCotacoes(positionList, "codigos");

    if (esource_positionQuote && esource_positionQuote.close) {
      esource_positionQuote.close();
    }
    if (interval_positionQuote) {
      // quem disparar pela segunda vez deve ter essa var no connect
      clearInterval(interval_positionQuote);
    }

    const symbols = symbolList.join(",");

    if (symbols) {
      const newSource = atualizarCotacaoPosicaoAPI({
        dispatch,
        arrayCotacoes: positionQuotes,
        codigos: symbols,
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
};

// position
export const startProactivePositionUpdateAction = () => {
  return (dispatch, getState) => {
    const {
      positionReducer: { eventSourcePosicao: esource_position },
    } = getState();

    if (esource_position && esource_position.close) {
      esource_position.close();
    }
  };
};

// emblem
export const startProactiveEmblemUpdateAction = () => {
  return (dispatch, getState) => {
    const {
      positionReducer: {
        posicoesCustodia: positionList,
        eventSourceEmblema: esource_emblem,
        setIntervalEmblema: interval_emblem,
      },
    } = getState();

    let idArray = [];

    if (esource_emblem && esource_emblem.close) {
      esource_emblem.close();
    }
    if (interval_emblem) {
      clearInterval(interval_emblem);
    }

    positionList.forEach((posicao) => {
      idArray.push(posicao.idEstrutura);
    });
    const ids = idArray.join(",");

    if (ids) {
    }
  };
};

// quote
export const startProactivePositionQuoteUpdateAction = () => {
  return async (dispatch, getState) => {
    const {
      positionReducer: {
        posicoesCustodia: positionList,
        eventSourceCotacoes: esource_positionQuote,
        setIntervalCotacoesPosicao: interval_positionQuote,
      },
    } = getState();

    const symbolList = await montaArrayCotacoes(positionList, "codigos");

    if (esource_positionQuote && esource_positionQuote.close) {
      esource_positionQuote.close();
    }
    if (interval_positionQuote) {
      // quem disparar pela segunda vez deve ter essa var no connect
      clearInterval(interval_positionQuote);
    }

    const symbols = symbolList.join(",");

    if (symbols) {
    }
  };
};
