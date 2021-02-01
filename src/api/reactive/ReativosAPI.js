// @collapse

import {
  adicionaPosicao,
  updateOnePositionState,
} from "redux/actions/posicao/utils";
import {
  url_emblemaReativo_ids,
  url_base_reativa,
  url_bookReativo_codigos,
  url_cotacaoReativa_codigos,
  url_ordensExecReativas_idUser,
  url_posicaoReativa_idUser,
  url_atualizarPrecosTHL_ids,
} from "api/url";
import {
  MUDAR_VARIAVEL_POSICAO_CUSTODIA,
  MODIFICAR_VARIAVEL_MULTILEG,
  MUDAR_VARIAVEL_THL,
  UPDATE_ONE_MULTIBOX,
} from "constants/MenuActionTypes";
import {
  LISTAR_BOOK_OFERTAS,
  PESQUISAR_ATIVO_BOLETA_API,
  LISTAR_ORDENS_EXECUCAO,
} from "constants/ApiActionTypes";

import { formatarDataDaAPI } from "shared/utils/Formatacoes";

import { EventSourcePolyfill } from "event-source-polyfill";
import produce from "immer";
import { actionType } from "constants/ActionTypes";

var EventSource = EventSourcePolyfill;

const intervaloAttReativa = 6000;

export const atualizarBookAPI = ({ dispatch, symbol, token }) => {
  var source = new EventSource(
    `${url_base_reativa}${url_bookReativo_codigos}${symbol}`,
    {
      headers: {
        Authorization: `${token.tokenType} ${token.accessToken}`,
      },
    },
  );
  source.onopen = function (event) {
    // console.log("open");
  };

  source.onmessage = function (event) {
    if (typeof event.data !== "undefined") {
      // console.log("chegou");
      let bookTables = {
        tabelaOfertasCompra: [],
        tabelaOfertasVenda: [],
      };

      var data = JSON.parse(event.data);

      //   let ativoRetornado = dados.symbol;
      if (data.bookOffers) {
        let newBooks = [...data.bookOffers];

        newBooks.forEach((item) => {
          if (item.type === "V") {
            bookTables.tabelaOfertasVenda.push(item);
          } else if (item.type === "C") {
            bookTables.tabelaOfertasCompra.push(item);
          }
        });
        bookTables.tabelaOfertasCompra.sort((a, b) => b.price - a.price);
        bookTables.tabelaOfertasVenda.sort((a, b) => b.price - a.price);
      }

      dispatch({
        type: LISTAR_BOOK_OFERTAS,
        payload: bookTables,
      });
    }
  };
  return source;
};

export const atualizarCotacaoMultilegAPI = ({
  dispatch,
  codigos,
  arrayCotacoes,
  token,
}) => {
  var source = new EventSource(
    `${url_base_reativa}${url_cotacaoReativa_codigos}${codigos}`,
    {
      headers: {
        Authorization: `${token.tokenType} ${token.accessToken}`,
      },
    },
  );

  let listaCotacoes = arrayCotacoes;

  atualizaListaReativa(
    dispatch,
    listaCotacoes,
    MODIFICAR_VARIAVEL_MULTILEG,
    "cotacoesMultileg",
    "interval_multilegQuotes",
    () => listaCotacoes,
    true,
  );

  source.onmessage = function (event) {
    if (typeof event.data !== "undefined") {
      var dados = JSON.parse(event.data);

      const currentQuote = dados.ultimo;
      const symbol = dados.symbol;

      const indice = listaCotacoes.findIndex(
        (cotacao) => cotacao.codigo === symbol,
      );

      if (indice !== -1) {
        const oldQuote = listaCotacoes[indice].valor;

        const oldBuyBook = listaCotacoes[indice].compra;
        const oldSellBook = listaCotacoes[indice].venda;

        if (currentQuote && oldQuote !== currentQuote)
          listaCotacoes[indice].valor = currentQuote;

        listaCotacoes[indice].compra = {
          price: dados.compra || oldBuyBook.price,
          qtty: dados.compraQtde || oldBuyBook.qtty,
          type: "C",
        };
        listaCotacoes[indice].venda = {
          price: dados.venda || oldSellBook.price,
          qtty: dados.vendaQtde || oldSellBook.qtty,
          type: "V",
        };
      }
    }
  };
  return source;
};

export const atualizarCotacaoPosicaoAPI = ({
  dispatch,
  codigos,
  arrayCotacoes,
  token,
}) => {
  var source = new EventSource(
    `${url_base_reativa}${url_cotacaoReativa_codigos}${codigos}`,
    {
      headers: {
        Authorization: `${token.tokenType} ${token.accessToken}`,
      },
    },
  );

  let listaCotacoes = arrayCotacoes;

  atualizaListaReativa(
    dispatch,
    listaCotacoes,
    MUDAR_VARIAVEL_POSICAO_CUSTODIA,
    "arrayCotacoes",
    "interval_positionQuote",
  );

  source.onmessage = function (event) {
    if (typeof event.data !== "undefined") {
      var dados = JSON.parse(event.data);

      const cotacaoAtual = dados.ultimo;
      const ativoRetornado = dados.symbol;

      const indice = listaCotacoes.findIndex(
        (ativo) => ativo.codigo === ativoRetornado,
      );

      if (indice !== -1) {
        //&& listaCotacoes[indice].cotacao !== cotacaoAtual tirar verificação para teste
        listaCotacoes[indice].cotacao = cotacaoAtual;
      } //
      else {
        const ativo = {
          codigo: ativoRetornado,
          cotacao: cotacaoAtual,
        };
        listaCotacoes.push(ativo);
      }
    }
  };
  return source;
};

export const atualizarCotacaoTHLAPI = ({
  dispatch,
  codigos,
  arrayCotacoes,
  token,
}) => {
  var source = new EventSource(
    `${url_base_reativa}${url_cotacaoReativa_codigos}${codigos}`,
    {
      headers: {
        Authorization: `${token.tokenType} ${token.accessToken}`,
      },
    },
  );

  let listaCotacoes = arrayCotacoes;

  atualizaListaReativa(
    dispatch,
    listaCotacoes,
    MUDAR_VARIAVEL_THL,
    "arrayCotacoes",
    "interval_thlQuotes",
  );

  source.onmessage = function (event) {
    if (typeof event.data !== "undefined") {
      var dados = JSON.parse(event.data);

      const cotacaoAtual = dados.ultimo;
      const ativoRetornado = dados.symbol;

      const indice = listaCotacoes.findIndex(
        (ativo) => ativo.codigo === ativoRetornado,
      );

      if (indice !== -1) {
        //&& listaCotacoes[indice].cotacao !== cotacaoAtual tirar verificação para teste
        listaCotacoes[indice].cotacao = cotacaoAtual;
      } //
      else {
        const ativo = {
          codigo: ativoRetornado,
          cotacao: cotacaoAtual,
        };
        listaCotacoes.push(ativo);
      }
    }
  };
  return source;
};

export const atualizarCotacaoBoletasAPI = ({
  dispatch,
  codigos,
  namespace,
  dadosPesquisa,
}) => {
  var source = new EventSource(
    `${url_base_reativa}${url_cotacaoReativa_codigos}${codigos}`,
    // {
    //   headers: {
    //     Authorization: "my secret jwt token",
    //   },
    // },
  );

  source.onmessage = function (event) {
    if (typeof event.data !== "undefined") {
      var dados = JSON.parse(event.data);

      const cotacaoAtual = dados.ultimo;

      if (cotacaoAtual && dadosPesquisa.cotacaoAtual !== cotacaoAtual) {
        dadosPesquisa.cotacaoAtual = cotacaoAtual;

        if (dados.ultimoHorario)
          dadosPesquisa.ultimoHorario = formatarDataDaAPI(
            dados.ultimoHorario,
          ).toLocaleTimeString();

        dispatch({
          type: `${PESQUISAR_ATIVO_BOLETA_API}${namespace}`,
          payload: { ...dadosPesquisa },
        });
      }
    }
  };
  return source;
};

export const atualizarEmblemasAPI = ({ dispatch, listaPrecos, ids, token }) => {
  var source = new EventSource(
    `${url_base_reativa}${url_emblemaReativo_ids}${ids}`,
    {
      headers: {
        Authorization: `${token.tokenType} ${token.accessToken}`,
      },
    },
  );

  const novaLista = [...listaPrecos];

  atualizaListaReativa(
    dispatch,
    novaLista,
    MUDAR_VARIAVEL_POSICAO_CUSTODIA,
    "arrayPrecos",
    "interval_emblem",
  );

  source.onmessage = function (event) {
    if (typeof event.data !== "undefined") {
      var dados = JSON.parse(event.data);

      const indice = novaLista.findIndex(
        (posicao) => posicao.idEstrutura === dados.id,
      );

      if (indice !== -1) {
        novaLista[indice].precoCompra = dados.min;
        novaLista[indice].precoVenda = dados.max;
        novaLista[indice].cotacaoAtual = dados.last;
      } //
      else {
        const preco = {
          precoCompra: dados.min,
          precoVenda: dados.max,
          cotacaoAtual: dados.last,
          idEstrutura: dados.id,
        };
        novaLista.push(preco);
      }
    }
  };

  return source;
};

export const atualizarPosicaoAPI = ({ dispatch, listaPosicoes, token }) => {
  var source = new EventSource(
    `${url_base_reativa}${url_posicaoReativa_idUser}`,
    {
      headers: {
        Authorization: `${token.tokenType} ${token.accessToken}`,
      },
    },
  );

  source.onmessage = function (event) {
    if (typeof event.data !== "undefined") {
      var posicoes = JSON.parse(event.data).positions;

      const novaLista = [...listaPosicoes];

      console.log(posicoes);

      posicoes.forEach((novaPosicao) => {
        const indice = novaLista.findIndex(
          (posicao) =>
            posicao.agrupadorPrincipal === novaPosicao.agrupadorPrincipal,
        );

        if (indice !== -1) {
          const posicaoAtualizada = adicionaPosicao(novaPosicao)[0];
          novaLista[indice] = posicaoAtualizada;
        } else {
          const posicaoAdicionada = adicionaPosicao(novaPosicao);
          novaLista.push(...posicaoAdicionada);
        }
      });

      dispatch(
        updateOnePositionState({
          attributeName: "posicoesCustodia",
          attributeValue: novaLista,
        }),
      );
    }
  };

  return source;
};

export const atualizarOrdensExecAPI = ({
  dispatch,
  token,
  listaOrdensExec,
}) => {
  var source = new EventSource(
    `${url_base_reativa}${url_ordensExecReativas_idUser}`,
    {
      headers: {
        Authorization: `${token.tokenType} ${token.accessToken}`,
      },
    },
  );

  // source.onopen = function (event) {
  //   console.log("open");
  // };

  // source.onerror = function (event) {
  //   console.log("ordens error:", event);
  // };

  source.onmessage = function (event) {
    if (typeof event.data !== "undefined") {
      var dados = JSON.parse(event.data);

      if (dados.orders && dados.orders.length) {
        const novaTabela = [...listaOrdensExec];
        dados.orders.forEach((novaOrdem) => {
          const indice = novaTabela.findIndex(
            (ordem) => ordem.id === novaOrdem.id,
          );
          if (indice !== -1) novaTabela[indice] = novaOrdem;
          else novaTabela.unshift(novaOrdem);
        });
        dispatch({ type: LISTAR_ORDENS_EXECUCAO, payload: novaTabela });
      }
    }
  };

  return source;
};

export const atualizarPrecosTHLAPI = ({
  ids,
  dispatch,
  token,
  priceStructures,
}) => {
  var source = new EventSource(
    `${url_base_reativa}${url_atualizarPrecosTHL_ids}${ids}`,
    {
      headers: {
        Authorization: `${token.tokenType} ${token.accessToken}`,
      },
    },
  );

  const updatedPriceStructures = [];

  function updateStructuresImmutable(state, updatedValue) {
    return produce(state, (draft) => {
      updatedValue.forEach((upItem) => {
        const index = draft.findIndex((item) => item.id === upItem.id);
        const updatedStructure = draft[index];

        if (index !== -1) {
          const { components, ...rest } = upItem;
          Object.assign(updatedStructure, rest);

          components.forEach((componentItem) => {
            const indexToUpdate = updatedStructure.components.findIndex(
              (componentToUpdate) => componentToUpdate.id === componentItem.id,
            );

            if (indexToUpdate !== -1) {
              Object.assign(
                updatedStructure.components[indexToUpdate],
                componentItem,
              );
            }
          });
        }
      });
    });
  }

  atualizaListaReativa(
    dispatch,
    updatedPriceStructures,
    MUDAR_VARIAVEL_THL,
    "precosTabelaVencimentos",
    "interval_thlStructures",
    () => updateStructuresImmutable(priceStructures, updatedPriceStructures),
  );

  source.onerror = function (event) {
    console.log("thl price update error:", event);
  };

  source.onmessage = function (event) {
    if (typeof event.data !== "undefined") {
      const priceStructure = JSON.parse(event.data);

      updatedPriceStructures.push(priceStructure);
    }
  };

  return source;
};

export const updateBoxDataAPI = ({ ids, dispatch, token, quoteBoxes }) => {
  var source = new EventSource(
    `${url_base_reativa}${url_atualizarPrecosTHL_ids}${ids}`,
    {
      headers: {
        Authorization: `${token.tokenType} ${token.accessToken}`,
      },
    },
  );

  const updatedBoxes = produce(quoteBoxes, (draft) => {
    draft[0].id += 1;
    draft[0].id -= 1;
  });

  const immutableFunction = (boxes) => {
    return produce(boxes, (draft) => {
      draft[0].id += 1;
      draft[0].id -= 1;
    });
  };

  atualizaListaReativa(
    dispatch,
    updatedBoxes,
    actionType.UPDATE_ONE_SYSTEM_STATE,
    "quoteBoxes",
    "interval_box",
    () => immutableFunction(updatedBoxes),
  );

  source.onerror = function (event) {
    // console.log("box update error:", event);
  };

  source.onmessage = function (event) {
    if (typeof event.data !== "undefined") {
      const boxData = JSON.parse(event.data);

      console.log(boxData);

      [].forEach((boxItem) => {
        const boxIndex = updatedBoxes.findIndex(
          (upBox) => upBox.structure.id === boxItem.structure.id,
        );

        if (boxIndex !== -1) {
          [
            ["last", "quote"],
            ["max", "buy"],
            ["min", "sell"],
          ].forEach((keyMap) => {
            const [key, mappedKey] = keyMap;

            if (boxItem[key] || boxItem[key] === 0) {
              updatedBoxes[boxIndex][mappedKey] = boxItem[key];
            }
          }); // buy = max ; sell = min ; quote = last

          [
            ["bookBuy", "buy"],
            ["bookSell", "sell"],
          ].forEach((keyMap) => {
            const [key, mappedKey] = keyMap;

            if (boxItem[key] && boxItem[key].length) {
              updatedBoxes[boxIndex].book[mappedKey] = boxItem[key];
            }
          }); // book.buy ; book.sell

          boxItem.structure.components.forEach((component) => {
            const componentIndex = updatedBoxes[
              boxIndex
            ].structure.components.findIndex(
              (upComponent) => upComponent.id === component.id,
            );

            if (componentIndex) {
            }
          });
        }
      });
    }
  };

  return source;
};

export const updateBoxStructuresAPI = ({
  ids,
  dispatch,
  token,
  boxesTab1Data,
}) => {
  var source = new EventSource(
    `${url_base_reativa}${url_atualizarPrecosTHL_ids}${ids}`,
    {
      headers: {
        Authorization: `${token.tokenType} ${token.accessToken}`,
      },
    },
  );

  const updatedBoxes = produce(boxesTab1Data, (draft) => {
    draft[0].id += 1;
    draft[0].id -= 1;
  });

  const immutableFunction = (boxes) => {
    return produce(boxes, (draft) => {
      draft[0].id += 1;
      draft[0].id -= 1;
    });
  };

  atualizaListaReativa(
    dispatch,
    updatedBoxes,
    UPDATE_ONE_MULTIBOX,
    "boxesTab1Data",
    "interval_multiBox",
    () => immutableFunction(updatedBoxes),
  );

  source.onerror = function (event) {
    // console.log("box update error:", event);
  };

  source.onmessage = function (event) {
    if (typeof event.data !== "undefined") {
      const boxData = JSON.parse(event.data);

      console.log(boxData);

      [].forEach((boxItem) => {
        const boxIndex = updatedBoxes.findIndex(
          (upBox) => upBox.structure.id === boxItem.structure.id,
        );

        if (boxIndex !== -1) {
          [
            ["last", "quote"],
            ["max", "buy"],
            ["min", "sell"],
          ].forEach((keyMap) => {
            const [key, mappedKey] = keyMap;

            if (boxItem[key] || boxItem[key] === 0) {
              updatedBoxes[boxIndex][mappedKey] = boxItem[key];
            }
          }); // buy = max ; sell = min ; quote = last

          [
            ["bookBuy", "buy"],
            ["bookSell", "sell"],
          ].forEach((keyMap) => {
            const [key, mappedKey] = keyMap;

            if (boxItem[key] && boxItem[key].length) {
              updatedBoxes[boxIndex].book[mappedKey] = boxItem[key];
            }
          }); // book.buy ; book.sell

          boxItem.structure.components.forEach((component) => {
            const componentIndex = updatedBoxes[
              boxIndex
            ].structure.components.findIndex(
              (upComponent) => upComponent.id === component.id,
            );

            if (componentIndex) {
            }
          });
        }
      });
    }
  };

  return source;
};

const atualizaListaReativa = (
  dispatch,
  lista,
  actionType,
  nomeLista,
  nomeSetInterval,
  immutableFunction = () => lista,
  cancelTimeout = false,
) => {
  const atualizarLista = () => {
    dispatch({
      type: actionType,
      payload: {
        attributeName: nomeLista,
        attributeValue: immutableFunction(), //lista.map((item) => ({ ...item }))
      },
    });
    dispatch({
      type: actionType,
      payload: {
        attributeName: `${nomeLista}ID`,
        attributeValue: Math.random(),
      },
    });
  };

  if (!cancelTimeout) setTimeout(atualizarLista, 1500);

  const setPrecos = setInterval(atualizarLista, intervaloAttReativa);

  dispatch({
    type: actionType,
    payload: {
      attributeName: nomeSetInterval,
      attributeValue: setPrecos,
    },
  });
};
