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
  url_listarPosicoes
} from "components/api/url";
import { MODIFICAR_ATRIBUTO_ABA } from "constants/MenuActionTypes";
import {
  LISTAR_BOOK_OFERTAS,
  PESQUISAR_ATIVO_BOLETA_API
} from "constants/ApiActionTypes";

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
      let ultimoHorario = new Date(body.ultimoHorario).toLocaleTimeString();

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
          vencimento: new Date(body.stock.endBusiness).toLocaleDateString(),
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
    })
    .catch(erro => {
      console.log(erro.response);
    });
};

export const pesquisarAtivoMultilegAPI = codigo_ativo => {
  var dados = {
    opcoes: [],
    vencimentos: [],
    //cotacaoAtual: 0,
    variacao: ""
  };

  return request
    .get(
      cors_anywhere +
        url_base +
        url_pesquisarOpcoesVencimentos_codigo +
        codigo_ativo
    )
    .retry(3)
    .then(async response => {
      const { body } = response;
      dados.opcoes = [...body.options];
      dados.vencimentos = [...body.expirations];
      const dadosAtivo = await pesquisarAtivoAPI(codigo_ativo);
      if (dadosAtivo) {
        dados.cotacaoAtual = dadosAtivo.cotacaoAtual;
        dados.variacao = dadosAtivo.porcentagem;

        return dados;
      }
    })
    .catch(erro => {
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

export const atualizarBookAPI = (
  dispatch,
  props,
  codigos,
  tipo,
  abasMultileg
) => {
  var source = new EventSource(
    "http://173.249.37.183:8090/books/symbols?symbols=" + codigos
  );

  source.onopen = function(event) {
    console.log("open");
  };

  source.onmessage = function(event) {
    if (typeof event.data !== "undefined") {
      let tabelas = {
        tabelaOfertasCompra: [],
        tabelaOfertasVenda: []
      };

      var dados = JSON.parse(event.data);

      let bookNovo = [...dados.bookOffers];
      let ativoRetornado = dados.symbol;

      bookNovo.forEach(item => {
        if (item.type === "V") {
          tabelas.tabelaOfertasVenda.push(item);
        } else if (item.type === "C") {
          tabelas.tabelaOfertasCompra.push(item);
        }
      });
      tabelas.tabelaOfertasCompra.sort((a, b) => b.price - a.price);
      tabelas.tabelaOfertasVenda.sort((a, b) => b.price - a.price);

      if (tipo === "book") {
        dispatch({
          type: LISTAR_BOOK_OFERTAS,
          payload: tabelas
        });
      }

      if (tipo === "multileg") {
        abasMultileg = [...abasMultileg];
        //const tabelaOfertas = abasMultileg[indice].tabelaMultileg;
        abasMultileg.forEach(aba => {
          aba.tabelaMultileg.forEach(oferta => {
            if (oferta.codigoSelecionado === ativoRetornado) {
              oferta.compra = tabelas.tabelaOfertasCompra[0];
              oferta.venda =
                tabelas.tabelaOfertasVenda[
                  tabelas.tabelaOfertasVenda.length - 1
                ];
            }
          });
        });

        dispatch({ type: MODIFICAR_ATRIBUTO_ABA, payload: abasMultileg });
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
  abasMultileg = [],
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
      var dados = JSON.parse(event.data);
      const cotacaoAtual = dados.ultimo;
      const ativoRetornado = dados.symbol;

      if (tipo === "boletas" && dadosPesquisa) {
        dadosPesquisa.cotacaoAtual = cotacaoAtual;
        dispatch({
          type: `${PESQUISAR_ATIVO_BOLETA_API}${namespace}`,
          payload: { ...dadosPesquisa }
        });
      } //
      else if (tipo === "multileg") {
        abasMultileg = [...abasMultileg];
        abasMultileg.forEach(aba => {
          if (aba.ativoAtual === ativoRetornado) {
            aba.valor = cotacaoAtual;
          }
          aba.tabelaMultileg.forEach(oferta => {
            if (oferta.codigoSelecionado === ativoRetornado) {
              oferta.cotacao = cotacaoAtual;
            }
          });
        });

        dispatch({ type: MODIFICAR_ATRIBUTO_ABA, payload: abasMultileg });
      }
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
