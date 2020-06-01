import request from "superagent";
import retryDelay from "superagent-retry-delay";
import { formatarDataDaAPI } from "components/utils/Formatacoes";
import {
  url_base,
  url_pesquisarAtivoBoletas_codigo,
  url_listarBookOfertas_codigo,
  url_enviarOrdem,
  url_pesquisarOpcoesVencimentos_codigo,
  url_pesquisarStrikes_codigo_vencimento,
  url_listarOrdensExecucao_,
  url_listarPosicoes,
  url_criarPosicaoMultileg_,
  url_criarAlertaOperacao_,
  url_cancelarOrdemExec_id,
  url_finalizarAMercado_id,
  url_aumentarQtde_id_qtde,
  url_aumentarPreco_id_valor,
  url_pesquisarListaStrike_codigo,
  url_listarTabelaInicialTHL_ativo_strike_tipo,
  url_recalcularPrecos_acao_ativo_strike_tipo,
  url_pesquisarCombinacoes_ativo,
  url_favoritarTHL_,
} from "components/api/url";

import {
  erro_pesquisar_ativo,
  sucesso_enviar_ordem,
  erro_enviar_ordem,
  sucesso_criar_alerta,
  erro_criar_alerta,
  erro_criar_posicao,
  sucesso_criar_posicao,
  erro_cancelar_ordem,
  sucesso_cancelar_ordem,
  sucesso_finalizar_a_mercado,
  erro_finalizar_a_mercado,
  sucesso_modificar_ordemExec,
  erro_modificar_ordemExec,
  erro_timeout,
  erro_listarBook,
  erro_listarTHL_thl,
  erro_pesquisarCombinacoes_thl,
  sucesso_favoritar_thl,
  erro_favoritar_thl,
} from "constants/AlertaErros";

retryDelay(request);

const timeout = 8000;

export const pesquisarAtivoAPI = (codigo) => {
  return request
    .get(`${url_base}${url_pesquisarAtivoBoletas_codigo}${codigo}`)
    .timeout(timeout)
    .retry(3, 2000)
    .then((response) => {
      const { body } = response;
      var dadosPesquisa;
      let oscilacao = "0,00";
      let cotacaoAtual = 0;
      let stepQtde = 100;

      let ultimoHorario = "";

      if (body.stock.market === "OddLot") stepQtde = 1;
      else if (body.stock.market === "Forex") stepQtde = 0.01;

      if (body.oscilacao) oscilacao = body.oscilacao;

      if (body.ultimo) cotacaoAtual = body.ultimo;

      if (body.ultimoHorario)
        ultimoHorario = formatarDataDaAPI(
          body.ultimoHorario
        ).toLocaleTimeString();

      if (["EquityPut", "EquityCall"].includes(body.stock.market)) {
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
          stepQtde: stepQtde,
          market: "tipo2",
          ativo: body.stock.symbol,
        };
      } else {
        dadosPesquisa = {
          resultadoAtivo: body.stock.symbol + ", " + body.stock.corporationName,
          codigoEspecificacao: body.stock.specificationCode,
          cotacaoAtual: cotacaoAtual,
          porcentagem: oscilacao,
          ultimoHorario: ultimoHorario,
          stepQtde: stepQtde,
          market: "tipo1",
          ativo: body.stock.symbol,
        };
      }
      return dadosPesquisa;
    })
    .catch((erro) => {
      mostrarErroConsulta(erro, erro_pesquisar_ativo);
      return {
        resultadoAtivo: "",
        codigoEspecificacao: "",
        cotacaoAtual: "",
        porcentagem: "",
        ultimoHorario: "",
        stepQtde: 100,
        market: "",
        ativo: "",
      };
    });
};

export const listarBookOfertaAPI = (codigo_ativo) => {
  let tabelas = {
    tabelaOfertasCompra: [],
    tabelaOfertasVenda: [],
  };
  return request
    .get(`${url_base}${url_listarBookOfertas_codigo}${codigo_ativo}`)
    .timeout(timeout)
    .retry(3, 2000)
    .then((response) => {
      const { body } = response;

      body.bookOffers.forEach((item) => {
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
    .catch((erro) => {
      mostrarErroConsulta(erro, erro_listarBook);
      return tabelas;
    });
};

export const enviarOrdemAPI = (json, token) => {
  const jsonStringBody = JSON.stringify(json);

  return request
    .post(`${url_base}${url_enviarOrdem}`)
    .timeout(timeout)
    .set({
      "Content-Type": "application/json",
      Authorization: `${token.tokenType} ${token.accessToken}`,
    })
    .send(jsonStringBody)
    .then((response) => {
      if (response.status === 201) alert(sucesso_enviar_ordem);
      else alert(erro_enviar_ordem);
    })
    .catch((erro) => {
      mostrarErroConsulta(erro, erro_enviar_ordem);
    });
};

export const pesquisarAtivoMultilegAPI = (codigo_ativo) => {
  var dados;

  return request
    .get(`${url_base}${url_pesquisarOpcoesVencimentos_codigo}${codigo_ativo}`)
    .timeout(timeout)
    .retry(3, 2000)
    .then(async (response) => {
      dados = {
        opcoes: [],
        vencimentos: [],
        //cotacaoAtual: 0,
        variacao: "",
        cotacaoAtual: 0,
        ativoPrincipal: "",
      };

      const { body } = response;
      dados.opcoes = [...body.options];
      dados.vencimentos = [...body.expirations];
      dados.ativoPrincipal = body.stock.symbol;
      const dadosAtivo = await pesquisarAtivoAPI(codigo_ativo);
      if (dadosAtivo) {
        dados.cotacaoAtual = Number(dadosAtivo.cotacaoAtual);
        dados.variacao = dadosAtivo.porcentagem;

        return dados;
      }
    })
    .catch((erro) => {
      mostrarErroConsulta(erro, erro_pesquisar_ativo);
      return null;
    });
};

export const pesquisarStrikesMultilegAPI = (codigo_ativo, vencimento) => {
  return request
    .get(
      `${url_base}${url_pesquisarStrikes_codigo_vencimento}${codigo_ativo}/${vencimento}`
    )
    .timeout(timeout)
    .retry(3, 2000)
    .then((response) => {
      return response.body;
    })
    .catch((erro) => {
      mostrarErroConsulta(erro);
      console.log(erro, "");
      return [];
    });
};

export const listarOrdensExecAPI = (idToken) => {
  return request
    .get(`${url_base}${url_listarOrdensExecucao_}`)
    .timeout(timeout)
    .retry(3, 2000)
    .set({ Authorization: `${idToken.tokenType} ${idToken.accessToken}` })
    .then((response) => {
      const { body } = response;
      let ofertas = [];

      body.forEach((oferta) => {
        ofertas.push(oferta);
      });

      return ofertas;
    })
    .catch((erro) => {
      mostrarErroConsulta(erro, "");
      return [];
    });
};

export const listarPosicoesAPI = (idToken) => {
  return request
    .get(`${url_base}${url_listarPosicoes}`)
    .timeout(timeout)
    .set({ Authorization: `${idToken.tokenType} ${idToken.accessToken}` })
    .retry(3, 2000)
    .then((response) => {
      const { body } = response;
      return body;
    })
    .catch((erro) => {
      mostrarErroConsulta(erro, "");
      return [];
    });
};

export const criarPosicaoMultilegAPI = (json) => {
  const jsonStringBody = JSON.stringify(json);

  return request
    .post(`${url_base}${url_criarPosicaoMultileg_}`)
    .timeout(timeout)
    .retry(2, 2000)
    .set({ "Content-Type": "application/json" })
    .send(jsonStringBody)
    .then((response) => {
      console.log("response", response);
      if (response.status === 201) alert(sucesso_criar_posicao);
      else alert(erro_criar_posicao);
    })
    .catch((erro) => {
      mostrarErroConsulta(erro, erro_criar_posicao);
    });
};

export const criarAlertaOperacaoAPI = (json) => {
  const jsonStringBody = JSON.stringify(json);

  return request
    .post(`${url_base}${url_criarAlertaOperacao_}`)
    .timeout(timeout)
    .retry(2, 2000)
    .set({ "Content-Type": "application/json" })
    .send(jsonStringBody)
    .then((response) => {
      if (response.status === 201) alert(sucesso_criar_alerta);
      else alert(erro_criar_alerta);
    })
    .catch((erro) => {
      mostrarErroConsulta(erro, erro_criar_alerta);
    });
};

export const cancelarOrdemExecAPI = (id, token) => {
  return request
    .put(`${url_base}${url_cancelarOrdemExec_id}${id}`)
    .set({
      Authorization: `${token.tokenType} ${token.accessToken}`,
    })
    .timeout(timeout)
    .then(() => {
      alert(sucesso_cancelar_ordem);
    })
    .catch((erro) => {
      mostrarErroConsulta(erro, erro_cancelar_ordem);
    });
};

export const finalizarAMercadoAPI = (id, token) => {
  return request
    .put(`${url_base}${url_finalizarAMercado_id}${id}`)
    .set({
      Authorization: `${token.tokenType} ${token.accessToken}`,
    })
    .timeout(timeout)
    .then(() => {
      alert(sucesso_finalizar_a_mercado);
    })
    .catch((erro) => {
      mostrarErroConsulta(erro, erro_finalizar_a_mercado);
    });
};

export const incrementarQtdeOrdemExecAPI = (id, qtde, token) => {
  return request
    .put(`${url_base}${url_aumentarQtde_id_qtde}${id}/${qtde}`)
    .timeout(timeout)
    .then(() => {
      alert(sucesso_modificar_ordemExec);
    })
    .catch((erro) => {
      mostrarErroConsulta(erro, erro_modificar_ordemExec);
    });
};

export const incrementarPrecoOrdemExecAPI = (id, preco, token) => {
  return request
    .put(`${url_base}${url_aumentarPreco_id_valor}${id}/${preco}`)
    .set({
      Authorization: `${token.tokenType} ${token.accessToken}`,
    })
    .timeout(timeout)
    .then(() => {
      alert(sucesso_modificar_ordemExec);
    })
    .catch((erro) => {
      mostrarErroConsulta(erro, erro_modificar_ordemExec);
    });
};

export const pesquisarListaStrikeTHLAPI = (ativo) => {
  return request
    .get(`${url_base}${url_pesquisarListaStrike_codigo}${ativo}`)
    .timeout(timeout)
    .retry(3, 2000)
    .then((response) => response.body)
    .catch((erro) => {
      mostrarErroConsulta(erro, erro_pesquisar_ativo);
      return [];
    });
};

export const listarTabelaInicialTHLAPI = (ativo, strike, tipo) => {
  return request
    .get(
      `${url_base}${url_listarTabelaInicialTHL_ativo_strike_tipo}${ativo}/${strike}/${tipo}`
    )
    .timeout(timeout)
    .retry(3, 2000)
    .then((response) => {
      return response.body;
    })
    .catch((erro) => {
      mostrarErroConsulta(erro, erro_listarTHL_thl);
      return [];
    });
};

export const recalcularPrecosTHLAPI = (
  ativo,
  ativoPesquisado,
  strike,
  tipo
) => {
  return request
    .get(
      `${url_base}${url_recalcularPrecos_acao_ativo_strike_tipo}${ativo}/${ativoPesquisado}/${strike}/${tipo}`
    )
    .retry(2, 2000)
    .timeout(timeout)
    .then((response) => response.body)
    .catch((erro) => {
      mostrarErroConsulta(erro, "");
      return [];
    });
};

export const pesquisarCombinacoesTHLAPI = (ativo) => {
  const url = url_pesquisarCombinacoes_ativo.split(" ");

  return request
    .get(`${url_base}${url[0]}${ativo}${url[1]}`)
    .retry(2, 2000)
    .timeout(timeout * 3)
    .then((response) => response.body)
    .catch((erro) => {
      mostrarErroConsulta(erro, erro_pesquisarCombinacoes_thl);
      return [];
    });
};

export const favoritarTHLAPI = (json, token) => {
  return request
    .post(`${url_base}${url_favoritarTHL_}`)
    .timeout(timeout)
    .set({
      "Content-Type": "application/json",
      Authorization: `${token.tokenType} ${token.accessToken}`,
    })
    .send(json)
    .then(() => alert(sucesso_favoritar_thl))
    .catch((erro) => {
      mostrarErroConsulta(erro, erro_favoritar_thl);
    });
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

export const mostrarErroConsulta = (erro, mensagem) => {
  console.log(erro);
  if (erro.timeout) {
    alert(erro_timeout);
  } else if (mensagem) alert(mensagem);
};
