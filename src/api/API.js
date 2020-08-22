import { formatarDataDaAPI } from "shared/utils/Formatacoes";
import {
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
} from "api/url";

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
import api from "./apiConfig";

const timeout = 8000;

export const pesquisarAtivoAPI = (codigo) => {
  return api
    .get(`${url_pesquisarAtivoBoletas_codigo}${codigo}`, {
      timeout,
      "axios-retry": {
        retries: 3,
        retryDelay: () => 2000,
      },
    })
    .then((response) => {
      const { data } = response;
      var dadosPesquisa;
      let oscilacao = "0,00";
      let cotacaoAtual = 0;
      let stepQtde = 100;

      let ultimoHorario = "";

      if (data.stock.market === "OddLot") stepQtde = 1;
      else if (data.stock.market === "Forex") stepQtde = 0.01;

      if (data.oscilacao) oscilacao = data.oscilacao;

      if (data.ultimo) cotacaoAtual = data.ultimo;

      if (data.ultimoHorario)
        ultimoHorario = formatarDataDaAPI(
          data.ultimoHorario,
        ).toLocaleTimeString();

      if (["EquityPut", "EquityCall"].includes(data.stock.market)) {
        dadosPesquisa = {
          resultadoAtivo: data.stock.symbol,
          strike: data.stock.strike,
          tipo: data.stock.type,
          model: data.stock.model,
          vencimento: formatarDataDaAPI(
            data.stock.endBusiness,
          ).toLocaleDateString(),
          symbol: data.stock.referenceStock.symbol,
          cotacaoAtual: cotacaoAtual,
          porcentagem: oscilacao,
          ultimoHorario: ultimoHorario,
          stepQtde: stepQtde,
          market: "tipo2",
          ativo: data.stock.symbol,
        };
      } else {
        dadosPesquisa = {
          resultadoAtivo: data.stock.symbol + ", " + data.stock.corporationName,
          codigoEspecificacao: data.stock.specificationCode,
          cotacaoAtual: cotacaoAtual,
          porcentagem: oscilacao,
          ultimoHorario: ultimoHorario,
          stepQtde: stepQtde,
          market: "tipo1",
          ativo: data.stock.symbol,
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
  return api
    .get(`${url_listarBookOfertas_codigo}${codigo_ativo}`, {
      timeout,
      "axios-retry": {
        retries: 3,
        retryDelay: () => 2000,
      },
    })
    .then((response) => {
      const { data } = response;

      data.bookOffers.forEach((item) => {
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

export const enviarOrdemAPI = (data) => {
  return api
    .post(`${url_enviarOrdem}`, data, { timeout })
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

  return api
    .get(`${url_pesquisarOpcoesVencimentos_codigo}${codigo_ativo}`, {
      timeout,
      "axios-retry": {
        retries: 3,
        retryDelay: () => 2000,
      },
    })
    .then(async (response) => {
      dados = {
        opcoes: [],
        vencimentos: [],
        //cotacaoAtual: 0,
        variacao: 0,
        cotacaoAtual: 0,
        ativoPrincipal: "",
      };

      const { data } = response;
      dados.opcoes = [...data.options];
      dados.vencimentos = [...data.expirations];
      dados.ativoPrincipal = data.stock.symbol;
      const dadosAtivo = await pesquisarAtivoAPI(codigo_ativo);
      if (dadosAtivo) {
        dados.cotacaoAtual = Number(dadosAtivo.cotacaoAtual);
        dados.variacao = Number(dadosAtivo.porcentagem);

        return dados;
      }
    })
    .catch((erro) => {
      mostrarErroConsulta(erro, erro_pesquisar_ativo);
      return null;
    });
};

export const pesquisarStrikesMultilegAPI = (codigo_ativo, vencimento) => {
  return api
    .get(
      `${url_pesquisarStrikes_codigo_vencimento}${codigo_ativo}/${vencimento}`,
      {
        timeout,
        "axios-retry": {
          retries: 3,
          retryDelay: () => 2000,
        },
      },
    )
    .then((response) => {
      return response.data;
    })
    .catch((erro) => {
      mostrarErroConsulta(erro);
      console.log(erro, "");
      return [];
    });
};

export const listarOrdensExecAPI = () => {
  return api
    .get(`${url_listarOrdensExecucao_}`, {
      timeout,
      "axios-retry": {
        retries: 3,
        retryDelay: () => 2000,
      },
    })
    .then((response) => {
      const { data } = response;
      const orders = data ? data : [];

      console.log("ordens: ", data);

      return orders;
    })
    .catch((erro) => {
      mostrarErroConsulta(erro, "");
      return [];
    });
};

export const listarPosicoesAPI = () => {
  return api
    .get(`${url_listarPosicoes}`, {
      timeout,
      "axios-retry": {
        retries: 3,
        retryDelay: () => 2000,
      },
    })
    .then((response) => {
      console.log("posição: ", response.data);

      return response.data;
    })
    .catch((erro) => {
      mostrarErroConsulta(erro, "");
      return [];
    });
};

export const criarPosicaoMultilegAPI = (data) => {
  return api
    .post(`${url_criarPosicaoMultileg_}`, data, {
      timeout,
      "axios-retry": {
        retries: 2,
        retryDelay: () => 2000,
      },
    })
    .then((response) => {
      console.log("response", response);
      if (response.status === 201) alert(sucesso_criar_posicao);
      else alert(erro_criar_posicao);
    })
    .catch((erro) => {
      mostrarErroConsulta(erro, erro_criar_posicao);
    });
};

export const criarAlertaOperacaoAPI = (data) => {
  return api
    .post(`${url_criarAlertaOperacao_}`, data, {
      timeout,
      "axios-retry": {
        retries: 2,
        retryDelay: () => 2000,
      },
    })
    .then((response) => {
      if (response.status === 201) alert(sucesso_criar_alerta);
      else alert(erro_criar_alerta);
    })
    .catch((erro) => {
      mostrarErroConsulta(erro, erro_criar_alerta);
    });
};

export const cancelarOrdemExecAPI = (id) => {
  return api
    .put(`${url_cancelarOrdemExec_id}${id}`, {
      timeout,
    })
    .then(() => {
      alert(sucesso_cancelar_ordem);
    })
    .catch((erro) => {
      mostrarErroConsulta(erro, erro_cancelar_ordem);
    });
};

export const finalizarAMercadoAPI = (id) => {
  return api
    .put(`${url_finalizarAMercado_id}${id}`, {
      timeout,
    })
    .then(() => {
      alert(sucesso_finalizar_a_mercado);
    })
    .catch((erro) => {
      mostrarErroConsulta(erro, erro_finalizar_a_mercado);
    });
};

export const incrementarQtdeOrdemExecAPI = (id, qtde) => {
  return api
    .put(`${url_aumentarQtde_id_qtde}${id}/${qtde}`, {
      timeout,
    })
    .then(() => {
      alert(sucesso_modificar_ordemExec);
    })
    .catch((erro) => {
      mostrarErroConsulta(erro, erro_modificar_ordemExec);
    });
};

export const incrementarPrecoOrdemExecAPI = (id, preco) => {
  return api
    .put(`${url_aumentarPreco_id_valor}${id}/${preco}`, {
      timeout,
    })
    .then(() => {
      alert(sucesso_modificar_ordemExec);
    })
    .catch((erro) => {
      mostrarErroConsulta(erro, erro_modificar_ordemExec);
    });
};

export const pesquisarListaStrikeTHLAPI = (ativo) => {
  return api
    .get(`${url_pesquisarListaStrike_codigo}${ativo}`, {
      timeout,
      "axios-retry": {
        retries: 3,
        retryDelay: () => 2000,
      },
    })
    .then((response) => response.data)
    .catch((erro) => {
      mostrarErroConsulta(erro, erro_pesquisar_ativo);
      return [];
    });
};

export const listarTabelaInicialTHLAPI = (ativo, strike, tipo) => {
  return api
    .get(
      `${url_listarTabelaInicialTHL_ativo_strike_tipo}${ativo}/${strike}/${tipo}`,
      {
        timeout,
        "axios-retry": {
          retries: 3,
          retryDelay: () => 2000,
        },
      },
    )
    .then((response) => {
      return response.data;
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
  tipo,
) => {
  return api
    .get(
      `${url_recalcularPrecos_acao_ativo_strike_tipo}${ativo}/${ativoPesquisado}/${strike}/${tipo}`,
      {
        timeout,
        "axios-retry": {
          retries: 2,
          retryDelay: () => 2000,
        },
      },
    )
    .then((response) => response.data)
    .catch((erro) => {
      mostrarErroConsulta(erro, "");
      return [];
    });
};

export const pesquisarCombinacoesTHLAPI = (ativo) => {
  const url = url_pesquisarCombinacoes_ativo.split(" ");

  return api
    .get(`${url[0]}${ativo}${url[1]}`, {
      timeout: timeout * 3,
      "axios-retry": {
        retries: 2,
        retryDelay: () => 2000,
      },
    })
    .then((response) => response.data)
    .catch((erro) => {
      mostrarErroConsulta(erro, erro_pesquisarCombinacoes_thl);
      return [];
    });
};

export const favoritarTHLAPI = (data) => {
  return api
    .post(`${url_favoritarTHL_}`, data, {
      timeout,
    })
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
