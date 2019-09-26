import request from "superagent";
import {
  cors_anywhere,
  url_base,
  url_pesquisarAtivoBoletas_codigo,
  url_listarBookOfertas_codigo,
  url_enviarOrdem
} from "components/api/url";

export const pesquisarAtivoAPI = codigo => {
  return request
    .get(cors_anywhere + url_base + url_pesquisarAtivoBoletas_codigo + codigo)
    .then(response => {
      const { body } = response;
      var dadosPesquisa;
      let oscilacao;
      let qtdeMultiplo100;
      let ultimoHorario = new Date(body.ultimoHorario).toLocaleTimeString();

      if (body.stock.market === "OddLot") qtdeMultiplo100 = false;
      else qtdeMultiplo100 = true;

      if (!oscilacao) oscilacao = "0,00";

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
          cotacaoAtual: body.ultimo,
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
          cotacaoAtual: body.ultimo,
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
    });
};

export const listarBookOfertaAPI = codigo_ativo => {
  return request
    .get(cors_anywhere + url_base + url_listarBookOfertas_codigo + codigo_ativo)
    .then(response => {
      const { body } = response;
      let tabelas = {
        tabelaOfertasCompra: [],
        tabelaOfertasVenda: []
      };

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
    .catch(erro => console.log(erro));
};

export const enviarOrdemAPI = json => {
  const jsonStringBody = JSON.stringify(json);

  return request
    .post(url_base + url_enviarOrdem)
    .send(json)
    .then(response => {
      console.log("response", response);
      console.log("body", response.body);
    })
    .catch(erro => {
      console.log(erro.response);
    });
};
