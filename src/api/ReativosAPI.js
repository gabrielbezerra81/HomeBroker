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
} from "constants/MenuActionTypes";
import {
  LISTAR_BOOK_OFERTAS,
  PESQUISAR_ATIVO_BOLETA_API,
  LISTAR_ORDENS_EXECUCAO,
} from "constants/ApiActionTypes";
import { formatarDataDaAPI } from "shared/utils/Formatacoes";

import { EventSourcePolyfill } from "event-source-polyfill";

var EventSource = EventSourcePolyfill;

const intervaloAttReativa = 6000;

export const atualizarBookAPI = ({ dispatch, codigos, tipo, token }) => {
  var source = new EventSource(
    `${url_base_reativa}${url_bookReativo_codigos}${codigos}`,
    {
      headers: {
        Authorization: `${token.tokenType} ${token.accessToken}`,
      },
    }
  );
  source.onopen = function (event) {
    // console.log("open");
  };

  source.onmessage = function (event) {
    if (typeof event.data !== "undefined") {
      // console.log("chegou");
      let tabelas = {
        tabelaOfertasCompra: [],
        tabelaOfertasVenda: [],
      };

      var dados = JSON.parse(event.data);

      //   let ativoRetornado = dados.symbol;
      if (dados.bookOffers) {
        let bookNovo = [...dados.bookOffers];

        bookNovo.forEach((item) => {
          if (item.type === "V") {
            tabelas.tabelaOfertasVenda.push(item);
          } else if (item.type === "C") {
            tabelas.tabelaOfertasCompra.push(item);
          }
        });
        tabelas.tabelaOfertasCompra.sort((a, b) => b.price - a.price);
        tabelas.tabelaOfertasVenda.sort((a, b) => b.price - a.price);
      }

      if (tipo === "book") {
        dispatch({
          type: LISTAR_BOOK_OFERTAS,
          payload: tabelas,
        });
      }
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
    }
  );

  let listaCotacoes = arrayCotacoes;

  atualizaListaReativa(
    dispatch,
    listaCotacoes,
    MODIFICAR_VARIAVEL_MULTILEG,
    "cotacoesMultileg",
    "setIntervalCotacoesMultileg"
  );

  source.onmessage = function (event) {
    if (typeof event.data !== "undefined") {
      var dados = JSON.parse(event.data);

      const cotacaoAtual = dados.ultimo;
      const ativoRetornado = dados.symbol;

      const indice = listaCotacoes.findIndex(
        (cotacao) => cotacao.codigo === ativoRetornado
      );

      if (indice !== -1) {
        listaCotacoes[indice].valor = cotacaoAtual;
        listaCotacoes[indice].compra = {
          price: dados.compra,
          qtty: dados.compraQtde,
          type: "C",
        };
        listaCotacoes[indice].venda = {
          price: dados.venda,
          qtty: dados.vendaQtde,
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
    }
  );

  let listaCotacoes = arrayCotacoes;

  atualizaListaReativa(
    dispatch,
    listaCotacoes,
    MUDAR_VARIAVEL_POSICAO_CUSTODIA,
    "arrayCotacoes",
    "setIntervalCotacoesPosicao"
  );

  source.onmessage = function (event) {
    if (typeof event.data !== "undefined") {
      var dados = JSON.parse(event.data);

      console.log(dados);

      const cotacaoAtual = dados.ultimo;
      const ativoRetornado = dados.symbol;

      const indice = listaCotacoes.findIndex(
        (ativo) => ativo.codigo === ativoRetornado
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
    }
  );

  let listaCotacoes = arrayCotacoes;

  atualizaListaReativa(
    dispatch,
    listaCotacoes,
    MUDAR_VARIAVEL_THL,
    "arrayCotacoes",
    "setIntervalCotacoesTHL"
  );

  source.onmessage = function (event) {
    if (typeof event.data !== "undefined") {
      var dados = JSON.parse(event.data);

      const cotacaoAtual = dados.ultimo;
      const ativoRetornado = dados.symbol;

      const indice = listaCotacoes.findIndex(
        (ativo) => ativo.codigo === ativoRetornado
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
    {
      headers: {
        Authorization: "my secret jwt token",
      },
    }
  );

  source.onmessage = function (event) {
    if (typeof event.data !== "undefined") {
      var dados = JSON.parse(event.data);

      const cotacaoAtual = dados.ultimo;

      if (cotacaoAtual && dadosPesquisa.cotacaoAtual !== cotacaoAtual) {
        dadosPesquisa.cotacaoAtual = cotacaoAtual;

        if (dados.ultimoHorario)
          dadosPesquisa.ultimoHorario = formatarDataDaAPI(
            dados.ultimoHorario
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
    }
  );

  const novaLista = [...listaPrecos];

  atualizaListaReativa(
    dispatch,
    novaLista,
    MUDAR_VARIAVEL_POSICAO_CUSTODIA,
    "arrayPrecos",
    "setIntervalEmblema"
  );

  source.onmessage = function (event) {
    if (typeof event.data !== "undefined") {
      var dados = JSON.parse(event.data);

      console.log(dados);

      const indice = novaLista.findIndex(
        (posicao) => posicao.idEstrutura === dados.id
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
    }
  );

  source.onmessage = function (event) {
    if (typeof event.data !== "undefined") {
      var posicoes = JSON.parse(event.data).positions;

      const novaLista = [...listaPosicoes];

      console.log(posicoes);

      posicoes.forEach((novaPosicao) => {
        const indice = novaLista.findIndex(
          (posicao) =>
            posicao.agrupadorPrincipal === novaPosicao.agrupadorPrincipal
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
        })
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
    }
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
            (ordem) => ordem.id === novaOrdem.id
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

export const atualizarPrecosTHLAPI = ({ ids, dispatch, token }) => {
  var source = new EventSource(
    `${url_base_reativa}${url_atualizarPrecosTHL_ids}${ids}`,
    {
      headers: {
        Authorization: `${token.tokenType} ${token.accessToken}`,
      },
    }
  );

  const updatedPriceStructures = [];

  atualizaListaReativa(
    dispatch,
    updatedPriceStructures,
    MUDAR_VARIAVEL_THL,
    "precosTabelaVencimentos",
    "setIntervalPrecosTHL"
  );

  source.onerror = function (event) {
    console.log("thl price update error:", event);
  };

  source.onmessage = function (event) {
    if (typeof event.data !== "undefined") {
      const priceStructure = JSON.parse(event.data);

      // console.log(source);

      // console.log(priceStructure);

      if (true) {
        const index = updatedPriceStructures.findIndex(
          (estrutura) => estrutura.id === priceStructure.id
        );

        if (index !== -1) {
          const { components, ...rest } = priceStructure;

          components.forEach((componentItem) => {
            const indexToUpdate = updatedPriceStructures[
              index
            ].components.findIndex(
              (componentToUpdate) => componentToUpdate.id === componentItem.id
            );

            if (indexToUpdate !== -1)
              Object.assign(
                updatedPriceStructures[index].components[indexToUpdate],
                componentItem
              );
          });

          Object.assign(updatedPriceStructures[index], { ...rest });
        } else updatedPriceStructures.push(priceStructure);
      }
    }
  };

  return source;
};

const atualizaListaReativa = (
  dispatch,
  lista,
  actionType,
  nomeLista,
  nomeSetInterval
) => {
  const atualizarLista = () => {
    dispatch({
      type: actionType,
      payload: {
        nome: nomeLista,
        valor: lista,
      },
    });
    dispatch({
      type: actionType,
      payload: {
        nome: `${nomeLista}ID`,
        valor: Math.random(),
      },
    });
  };

  setTimeout(atualizarLista, 1500);

  const setPrecos = setInterval(atualizarLista, intervaloAttReativa);

  dispatch({
    type: actionType,
    payload: {
      nome: nomeSetInterval,
      valor: setPrecos,
    },
  });
};
