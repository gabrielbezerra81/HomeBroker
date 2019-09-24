import request from "superagent";
import {
  cors_anywhere,
  url_base,
  url_pesquisarAtivoBoletas_codigo
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
          endBusiness: new Date(body.stock.endBusiness).toLocaleDateString(),
          symbol: body.stock.referenceStock.symbol,
          cotacaoAtual: body.ultimo,
          porcentagem: oscilacao,
          ultimoHorario: ultimoHorario,
          qtdeMultiplo100: qtdeMultiplo100,
          market: "tipo2"
        };
      } else {
        dadosPesquisa = {
          resultadoAtivo: body.stock.symbol + ", " + body.stock.corporationName,
          codigoEspecificacao: body.stock.specificationCode,
          cotacaoAtual: body.ultimo,
          porcentagem: oscilacao,
          ultimoHorario: ultimoHorario,
          qtdeMultiplo100: qtdeMultiplo100,
          market: "tipo1"
        };
      }
      return dadosPesquisa;
    })
    .catch(erro => {
      console.log(erro);
    });
};
