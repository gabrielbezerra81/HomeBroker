import request from "superagent";
import {
  cors_anywhere,
  url_base,
  url_pesquisarAtivoBoletas_codigo,
  url_listarBookOfertas_codigo,
  url_enviarOrdem,
  url_pesquisarOpcoesVencimentos_codigo,
  url_pesquisarStrikes_codigo_vencimento,
  url_listarOrdensExecucao_,
  url_listarPosicoes,
  url_emblemaReativo_ids
} from "components/api/url";
import {
  MODIFICAR_ATRIBUTO_ABA,
  MUDAR_VARIAVEL_POSICAO_CUSTODIA
} from "constants/MenuActionTypes";
import {
  LISTAR_BOOK_OFERTAS,
  PESQUISAR_ATIVO_BOLETA_API,
  ATUALIZAR_SOURCE_EVENT_MULTILEG
} from "constants/ApiActionTypes";
import { formatarDataDaAPI } from "components/utils/Formatacoes";
import { atualizarTabelaAntiga } from "components/redux/actions/api_actions/bookOfertaAPIActions";

export const pesquisarAtivoAPI = codigo => {
  return request
    .get(cors_anywhere + url_base + url_pesquisarAtivoBoletas_codigo + codigo)
    .retry(3)
    .then(response => {
      const { body } = response;
      var dadosPesquisa;
      let oscilacao;
      let cotacaoAtual = 0;
      let qtdeMultiplo100;

      let ultimoHorario = formatarDataDaAPI(
        body.ultimoHorario
      ).toLocaleTimeString();

      if (body.stock.market === "OddLot") qtdeMultiplo100 = false;
      else qtdeMultiplo100 = true;

      oscilacao = body.oscilacao;
      if (!oscilacao) oscilacao = "0,00";
      cotacaoAtual = body.ultimo;
      if (!cotacaoAtual) cotacaoAtual = 0;

      if (
        body.stock.market === "EquityCall" ||
        body.stock.market === "EquityPut"
      ) {
        dadosPesquisa = {
          resultadoAtivo: body.stock.symbol,
          strike: body.stock.strike,
          tipo: body.stock.type,
          model: body.stock.model,
          vencimento: formatarDataDaAPI(
            body.stock.endBusiness
          ).toLocaleDateString(),
          symbol: body.stock.referenceStock.symbol,
          cotacaoAtual: cotacaoAtual,
          porcentagem: oscilacao,
          ultimoHorario: ultimoHorario,
          qtdeMultiplo100: qtdeMultiplo100,
          market: "tipo2",
          ativo: body.stock.symbol
        };
      } else {
        dadosPesquisa = {
          resultadoAtivo: body.stock.symbol + ", " + body.stock.corporationName,
          codigoEspecificacao: body.stock.specificationCode,
          cotacaoAtual: cotacaoAtual,
          porcentagem: oscilacao,
          ultimoHorario: ultimoHorario,
          qtdeMultiplo100: qtdeMultiplo100,
          market: "tipo1",
          ativo: body.stock.symbol
        };
      }
      return dadosPesquisa;
    })
    .catch(erro => {
      console.log(erro);
      return {
        resultadoAtivo: "",
        codigoEspecificacao: "",
        cotacaoAtual: "",
        porcentagem: "",
        ultimoHorario: "",
        qtdeMultiplo100: "",
        market: "",
        ativo: ""
      };
    });
};

export const listarBookOfertaAPI = codigo_ativo => {
  let tabelas = {
    tabelaOfertasCompra: [],
    tabelaOfertasVenda: []
  };
  return request
    .get(cors_anywhere + url_base + url_listarBookOfertas_codigo + codigo_ativo)
    .retry(3)
    .then(response => {
      const { body } = response;

      body.bookOffers.forEach(item => {
        if (item.type === "V") {
          tabelas.tabelaOfertasVenda.push(item);
        } else if (item.type === "C") {
          tabelas.tabelaOfertasCompra.push(item);
        }
      });
      tabelas.tabelaOfertasCompra.sort((a, b) => b.price - a.price);
      tabelas.tabelaOfertasVenda.sort((a, b) => b.price - a.price);

      return tabelas;
    })
    .catch(erro => {
      console.log(erro);
      return tabelas;
    });
};

export const enviarOrdemAPI = json => {
  const jsonStringBody = JSON.stringify(json);

  return request
    .post(cors_anywhere + url_base + url_enviarOrdem)
    .retry(2)
    .set({ "Content-Type": "application/json" })
    .send(jsonStringBody)
    .then(response => {
      console.log("response", response);
      if (response.status === 201) alert("Ordem enviada com sucesso");
      else alert("Falha ao enviar ordem");
    })
    .catch(erro => {
      console.log(erro.response);
      alert("Falha ao enviar ordem");
    });
};

export const pesquisarAtivoMultilegAPI = codigo_ativo => {
  var dados;

  return request
    .get(
      cors_anywhere +
        url_base +
        url_pesquisarOpcoesVencimentos_codigo +
        codigo_ativo
    )
    .retry(3)
    .then(async response => {
      dados = {
        opcoes: [],
        vencimentos: [],
        //cotacaoAtual: 0,
        variacao: "",
        cotacaoAtual: 0
      };

      const { body } = response;
      dados.opcoes = [...body.options];
      dados.vencimentos = [...body.expirations];
      const dadosAtivo = await pesquisarAtivoAPI(codigo_ativo);
      if (dadosAtivo) {
        dados.cotacaoAtual = Number(dadosAtivo.cotacaoAtual);
        dados.variacao = dadosAtivo.porcentagem;

        return dados;
      }
    })
    .catch(erro => {
      alert("Falha ao pesquisar ativo");
      console.log(erro);
      return dados;
    });
};

export const pesquisarStrikesMultilegAPI = (codigo_ativo, vencimento) => {
  return request
    .get(
      cors_anywhere +
        url_base +
        url_pesquisarStrikes_codigo_vencimento +
        codigo_ativo +
        "/" +
        vencimento
    )
    .retry(3)
    .then(response => {
      return response.body;
    })
    .catch(erro => {
      console.log(erro);
      return [];
    });
};

export const listarOrdensExecAPI = () => {
  return request
    .get(cors_anywhere + url_base + url_listarOrdensExecucao_)
    .retry(3)
    .then(response => {
      const { body } = response;
      let ofertas = [];

      body.forEach(oferta => {
        ofertas.push(oferta);
        oferta.nextOrders.forEach(ordemNext => {
          ofertas.push(ordemNext);
        });
      });

      return ofertas;
    })
    .catch(erro => {
      console.log(erro);
      return [];
    });
};

export const listarPosicoesAPI = () => {
  return request
    .get(cors_anywhere + url_base + url_listarPosicoes)
    .retry(3)
    .then(response => {
      const { body } = response;
      return body;
    })
    .catch(erro => {
      console.log(erro);
      return [];
    });
};

export const atualizarBookAPI = (dispatch, props, codigos, tipo, multileg) => {
  var source = new EventSource(
    "http://173.249.37.183:8090/books/symbols?symbols=" + codigos
  );
  source.onopen = function(event) {
    console.log("open");
  };

  source.onmessage = function(event) {
    if (typeof event.data !== "undefined") {
      console.log("chegou");
      let tabelas = {
        tabelaOfertasCompra: [],
        tabelaOfertasVenda: []
      };

      var dados = JSON.parse(event.data);

      let ativoRetornado = dados.symbol;
      if (dados.bookOffers) {
        let bookNovo = [...dados.bookOffers];
        bookNovo.forEach(item => {
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
          payload: atualizarTabelaAntiga(tabelas)
        });
      }

      if (tipo === "multileg" && dados.bookOffers) {
        let permitirDispatch = false;
        let abasMultileg = [...multileg];

        abasMultileg.forEach(aba => {
          aba.tabelaMultileg.forEach(oferta => {
            if (oferta.codigoSelecionado === ativoRetornado) {
              const valorCompra = tabelas.tabelaOfertasCompra[0];
              const valorVenda =
                tabelas.tabelaOfertasVenda[
                  tabelas.tabelaOfertasVenda.length - 1
                ];
              if (oferta.compra !== valorCompra) {
                oferta.compra = valorCompra;
                permitirDispatch = true;
              }
              if (oferta.venda !== valorVenda) {
                oferta.venda = valorVenda;
                permitirDispatch = true;
              }
            }
          });
        });

        if (permitirDispatch) {
          dispatch({ type: MODIFICAR_ATRIBUTO_ABA, payload: abasMultileg });
        }
        dispatch({
          type: ATUALIZAR_SOURCE_EVENT_MULTILEG,
          payload: source,
          nomeVariavel: "eventSource"
        });
      }
    }
  };
  return source;
};

export const atualizarCotacaoAPI = (
  dispatch,
  props,
  codigos,
  tipo,
  multileg = [],
  namespace = "",
  dadosPesquisa = null
) => {
  var source = new EventSource(
    "http://173.249.37.183:8090/quotes/symbols?symbols=" + codigos
  );

  source.onopen = function(event) {
    console.log("open");
  };

  source.onmessage = function(event) {
    if (typeof event.data !== "undefined") {
      console.log("chegou");
      var dados = JSON.parse(event.data);
      const cotacaoAtual = dados.ultimo;
      const ativoRetornado = dados.symbol;

      if (tipo === "boletas" && dadosPesquisa) {
        if (dadosPesquisa.cotacaoAtual !== cotacaoAtual) {
          dadosPesquisa.cotacaoAtual = cotacaoAtual;
          dadosPesquisa.ultimoHorario = formatarDataDaAPI(
            dados.ultimoHorario
          ).toLocaleTimeString();

          dispatch({
            type: `${PESQUISAR_ATIVO_BOLETA_API}${namespace}`,
            payload: { ...dadosPesquisa }
          });
        }
      } //
      else if (tipo === "multileg") {
        let permitirDispatch = false;
        const abasMultileg = [...multileg];
        abasMultileg.forEach(aba => {
          if (aba.ativoAtual === ativoRetornado) {
            if (aba.valor !== cotacaoAtual) {
              aba.valor = cotacaoAtual;
              permitirDispatch = true;
            }
          }
          aba.tabelaMultileg.forEach(oferta => {
            if (oferta.codigoSelecionado === ativoRetornado) {
              if (oferta.cotacao !== cotacaoAtual) {
                oferta.cotacao = cotacaoAtual;
                permitirDispatch = true;
              }
            }
          });
        });

        if (permitirDispatch) {
          dispatch({ type: MODIFICAR_ATRIBUTO_ABA, payload: abasMultileg });
        }
        dispatch({
          type: ATUALIZAR_SOURCE_EVENT_MULTILEG,
          payload: source,
          nomeVariavel: "eventSourceCotacao"
        });
      }
    }
  };
  return source;
};

export const atualizarEmblemasAPI = (dispatch, listaPosicoes, ids) => {
  var source = new EventSource(url_emblemaReativo_ids + ids);

  source.onopen = function(event) {
    console.log("open");
  };

  source.onmessage = function(event) {
    if (typeof event.data !== "undefined") {
      var dados = JSON.parse(event.data);
      listaPosicoes = [...listaPosicoes];

      listaPosicoes.forEach(posicao => {
        if (posicao.idEstrutura === dados.id) {
          posicao.precoCompra = dados.min;
          posicao.precoVenda = dados.max;
          posicao.cotacaoAtual = dados.last;
        }
      });

      dispatch({
        type: MUDAR_VARIAVEL_POSICAO_CUSTODIA,
        payload: { nome: "posicoesCustodia", valor: listaPosicoes }
      });
    }
  };
  return source;
};

export const travarDestravarClique = (modo, id) => {
  if (modo === "travar") {
    document.body.style.cursor = "wait";
    document.getElementById(id).style.pointerEvents = "none";
  }
  if (modo === "destravar") {
    document.body.style.cursor = "auto";
    document.getElementById(id).style.pointerEvents = "all";
  }
};
