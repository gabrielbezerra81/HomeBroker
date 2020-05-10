import { atualizarTabelaAntiga } from "components/redux/actions/api_actions/bookOfertaAPIActions";
import { adicionaPosicao } from "components/redux/actions/menu_actions/PosicaoActions";
import {
  url_emblemaReativo_ids,
  url_base_reativa,
  url_bookReativo_codigos,
  url_cotacaoReativa_codigos,
  url_ordensExecReativas_idUser,
  url_posicaoReativa_idUser,
  url_atualizarPrecosTHL_ids,
} from "components/api/url";
import {
  MUDAR_VARIAVEL_POSICAO_CUSTODIA,
  MODIFICAR_VARIAVEL_MULTILEG,
  MUDAR_VARIAVEL_THL,
} from "constants/MenuActionTypes";
import {
  LISTAR_BOOK_OFERTAS,
  PESQUISAR_ATIVO_BOLETA_API,
  ATUALIZAR_SOURCE_EVENT_MULTILEG,
  LISTAR_ORDENS_EXECUCAO,
} from "constants/ApiActionTypes";
import { formatarDataDaAPI } from "components/utils/Formatacoes";

const intervaloAttReativa = 3000;

export const atualizarBookAPI = (
  dispatch,
  props,
  codigos,
  tipo,
  rembook //booksMultileg
) => {
  var source = new EventSource(
    `${url_base_reativa}${url_bookReativo_codigos}${codigos}`
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

      let ativoRetornado = dados.symbol;
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
          payload: atualizarTabelaAntiga(tabelas),
        });
      }

      if (tipo === "multileg" && dados.bookOffers) {
        let permitirDispatch = false;
        let novosBooks = [...rembook];

        novosBooks.forEach((book) => {
          if (book.codigo === ativoRetornado) {
            const valorCompra = tabelas.tabelaOfertasCompra[0];
            const valorVenda =
              tabelas.tabelaOfertasVenda[tabelas.tabelaOfertasVenda.length - 1];

            if (!book.compra || book.compra.price !== valorCompra.price) {
              book.compra = valorCompra;
              permitirDispatch = true;
            }
            if (!book.venda || book.venda.price !== valorVenda.price) {
              book.venda = valorVenda;
              permitirDispatch = true;
            }
          }
        });

        if (permitirDispatch) {
          dispatch({
            type: MODIFICAR_VARIAVEL_MULTILEG,
            payload: { nome: "rembook", valor: novosBooks },
          });
        }
        dispatch({
          type: ATUALIZAR_SOURCE_EVENT_MULTILEG,
          payload: source,
          nomeVariavel: "eventSource",
        });
      }
    }
  };
  return source;
};

// TODO: a cada pesquisa no multileg deve ser feito o clear Interval
export const atualizarCotacaoAPI = (
  dispatch,
  codigos,
  tipo, // Quem disparou a função, ex: multileg, posição, boleta de compra e venda
  arrayCotacoes = [], // Usado para o multileg ou para posição
  namespace = "", // Usado para disparar atualização para a boleta de compra e venda correta
  dadosPesquisa = null
) => {
  var source = new EventSource(
    `${url_base_reativa}${url_cotacaoReativa_codigos}${codigos}`
  );

  let listaCotacoes = arrayCotacoes;
  if (["multileg", "posicao"].includes(tipo)) {
    let actionType = MODIFICAR_VARIAVEL_MULTILEG;
    let nomeLista = "cotacoesMultileg";
    let nomeSetInterval = "setIntervalCotacoesMultileg";

    if (tipo === "posicao") {
      actionType = MUDAR_VARIAVEL_POSICAO_CUSTODIA;
      nomeLista = "arrayCotacoes";
      nomeSetInterval = "setIntervalCotacoesPosicao";
    }

    atualizaListaReativa(
      dispatch,
      listaCotacoes,
      actionType,
      nomeLista,
      nomeSetInterval
    );
  }

  source.onmessage = function (event) {
    if (typeof event.data !== "undefined") {
      var dados = JSON.parse(event.data);

      const cotacaoAtual = dados.ultimo;
      const ativoRetornado = dados.symbol;

      if (tipo === "boletas" && dadosPesquisa) {
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
      } //
      else if (tipo === "multileg") {
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
      } //
      else if (tipo === "posicao") {
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
    }
  };
  return source;
};

export const atualizarEmblemasAPI = (dispatch, listaPrecos, ids) => {
  var source = new EventSource(
    `${url_base_reativa}${url_emblemaReativo_ids}${ids}`
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

export const atualizarPosicaoAPI = (
  dispatch,
  listaPosicoes,
  idUsuario,
  props
) => {
  var source = new EventSource(
    `${url_base_reativa}${url_posicaoReativa_idUser}${idUsuario}`
  );

  source.onopen = function (event) {
    console.log("open");
  };

  source.onmessage = function (event) {
    if (typeof event.data !== "undefined") {
      var grupoPosicao = JSON.parse(event.data);
      listaPosicoes = [...listaPosicoes];

      const indice = listaPosicoes.findIndex(
        (posicao) =>
          posicao.agrupadorPrincipal === grupoPosicao.agrupadorPrincipal
      );
      let permitirDispatch = false;

      if (indice !== -1) {
        const posicaoAtualizada = adicionaPosicao(grupoPosicao)[0];
        listaPosicoes[indice] = posicaoAtualizada;
        permitirDispatch = true;
      } //
      else {
        const novaPosicao = adicionaPosicao(grupoPosicao);
        listaPosicoes.push(...novaPosicao);
        permitirDispatch = true;
      }
      if (permitirDispatch)
        dispatch({
          type: MUDAR_VARIAVEL_POSICAO_CUSTODIA,
          payload: { nome: "posicoesCustodia", valor: listaPosicoes },
        });
    }
  };

  return source;
};

export const atualizarOrdensExecAPI = (dispatch, token, listaOrdensExec) => {
  var source = new EventSource(
    `${url_base_reativa}${url_ordensExecReativas_idUser}${token}`
  );

  source.onmessage = function (event) {
    if (typeof event.data !== "undefined") {
      var dados = JSON.parse(event.data);

      if (dados.orders && dados.orders.length > 0) {
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

export const atualizarPrecosTHLAPI = (ids, dispatch) => {
  var source = new EventSource(
    `${url_base_reativa}${url_atualizarPrecosTHL_ids}${ids}`
  );

  const novosPrecos = [];

  atualizaListaReativa(
    dispatch,
    novosPrecos,
    MUDAR_VARIAVEL_THL,
    "precosTabelaVencimentos",
    "setPrecosIntervalo"
  );

  source.onmessage = function (event) {
    if (typeof event.data !== "undefined") {
      var dados = JSON.parse(event.data);
      const indice = novosPrecos.findIndex(
        (estrutura) => estrutura.id === dados.id
      );
      if (indice !== -1) novosPrecos[indice] = dados;
      else novosPrecos.push(dados);
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
