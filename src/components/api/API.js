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

export const pesquisarAtivoAPI = codigo => {
  return request
    .get(cors_anywhere + url_base + url_pesquisarAtivoBoletas_codigo + codigo)
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
    .then(response => {
      const { body } = response;
      return body;
    })
    .catch(erro => {
      console.log(erro);
      return [];
    });
};

export const listarPosicoesAPI = () => {
  return request
    .get(cors_anywhere + url_base + url_listarPosicoes)
    .then(response => {
      const { body } = response;
      return body;
    })
    .catch(erro => {
      console.log(erro);
      return [];
    });
};
