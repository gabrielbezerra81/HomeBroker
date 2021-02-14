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
  url_criarAlertaOperacao_param_operator,
  url_cancelarOrdemExec_id,
  url_finalizarAMercado_id,
  url_aumentarQtde_id_qtde,
  url_aumentarPreco_id_valor,
  url_pesquisarListaStrike_codigo,
  url_listarTabelaInicialTHL_ativo_strike_tipo,
  url_recalcularPrecos_acao_ativo_strike_tipo,
  url_pesquisarCombinacoes_ativo,
  url_favoritarTHL_,
  url_addQuoteBox_groupName,
  url_listarAlertas,
  url_box,
  url_createPositionBox,
  url_createBoxAlert,
  url_listPositionBox,
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
  error_add_box,
  success_add_box,
  error_delete_box,
  error_delete_alert,
} from "constants/AlertaErros";
import api from "./apiConfig";

const timeout = 45000;

export const pesquisarAtivoAPI = async (codigo) => {
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
      // TODO: ativar alerta quando Adriano subir correção
      // showAPIErrorAndAlert(erro, erro_pesquisar_ativo);
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

export const listarBookOfertaAPI = async (codigo_ativo) => {
  let tabelas = {
    tabelaOfertasCompra: [],
    tabelaOfertasVenda: [],
    success: false,
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

      tabelas.success = true;

      return tabelas;
    })
    .catch((erro) => {
      showAPIErrorAndAlert(erro, erro_listarBook);
      return tabelas;
    });
};

export const enviarOrdemAPI = async (data) => {
  return api
    .post(`${url_enviarOrdem}`, data, { timeout })
    .then((response) => {
      timedAlert(sucesso_enviar_ordem);

      return response.data;
    })
    .catch((erro) => {
      showAPIErrorAndAlert(erro, erro_enviar_ordem);
    });
};

export const pesquisarAtivoMultilegAPI = async (codigo_ativo) => {
  return api
    .get(`${url_pesquisarOpcoesVencimentos_codigo}${codigo_ativo}`, {
      timeout,
      "axios-retry": {
        retries: 3,
        retryDelay: () => 2000,
      },
    })
    .then(async (response) => {
      const dados = {
        opcoes: [],
        vencimentos: [],
        //cotacaoAtual: 0,
        variacao: 0,
        cotacaoAtual: 0,
        ativoPrincipal: "",
        market: "",
      };

      const { data } = response;

      dados.opcoes = [...data.options];
      dados.vencimentos = [...data.expirations];
      dados.ativoPrincipal = data.stock.symbol;

      try {
        const { data: quoteData } = await api.get(
          `${url_pesquisarAtivoBoletas_codigo}${codigo_ativo}`,
        );

        dados.market = quoteData.stock.market;

        if (quoteData) {
          dados.cotacaoAtual = Number(quoteData.ultimo || 0);
          dados.variacao = Number(quoteData.porcentagem || 0);
        }
      } catch (error) {}

      return dados;
    })
    .catch((erro) => {
      showAPIErrorAndAlert(erro, erro_pesquisar_ativo);
      return null;
    });
};

export const pesquisarStrikesMultilegAPI = async (codigo_ativo, vencimento) => {
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
      showAPIErrorAndAlert(erro);
      console.log(erro, "");
      return [];
    });
};

export const listarOrdensExecAPI = async () => {
  return api
    .get(`${url_listarOrdensExecucao_}`, {
      timeout,
      "axios-retry": {
        retries: 3,
        retryDelay: () => 2000,
      },
    })
    .then((response) => {
      return response.data;
    })
    .catch((erro) => {
      showAPIErrorAndAlert(erro, "");
      return [];
    });
};

export const listarPosicoesAPI = async () => {
  return api
    .get(`${url_listarPosicoes}`, {
      timeout,
      "axios-retry": {
        retries: 3,
        retryDelay: () => 2000,
      },
    })
    .then((response) => {
      return response.data;
    })
    .catch((erro) => {
      showAPIErrorAndAlert(erro, "");
      return [];
    });
};

export const criarPosicaoMultilegAPI = async (data) => {
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
      if (response.status === 201) {
        timedAlert(sucesso_criar_posicao);
      } else {
        timedAlert(erro_criar_posicao);
      }
    })
    .catch((erro) => {
      showAPIErrorAndAlert(erro, erro_criar_posicao);
    });
};

export const criarAlertaOperacaoAPI = async ({ param, operator, data }) => {
  return api
    .post(
      `${url_criarAlertaOperacao_param_operator}${param}/${operator}`,
      data,
      {
        timeout,
        "axios-retry": {
          retries: 2,
          retryDelay: () => 2000,
        },
      },
    )
    .then((response) => {
      timedAlert(sucesso_criar_alerta);
      return response.data;
    })
    .catch((erro) => {
      showAPIErrorAndAlert(erro, erro_criar_alerta);
    });
};

export const cancelarOrdemExecAPI = async (id) => {
  return api
    .put(`${url_cancelarOrdemExec_id}${id}`, {
      timeout,
    })
    .then(() => {
      timedAlert(sucesso_cancelar_ordem);
    })
    .catch((erro) => {
      showAPIErrorAndAlert(erro, erro_cancelar_ordem);
    });
};

export const finalizarAMercadoAPI = async (id) => {
  return api
    .put(`${url_finalizarAMercado_id}${id}`, {
      timeout,
    })
    .then(() => {
      timedAlert(sucesso_finalizar_a_mercado);
    })
    .catch((erro) => {
      showAPIErrorAndAlert(erro, erro_finalizar_a_mercado);
    });
};

export const incrementarQtdeOrdemExecAPI = async (id, qtde) => {
  return api
    .put(`${url_aumentarQtde_id_qtde}${id}/${qtde}`, {
      timeout,
    })
    .then(() => {
      timedAlert(sucesso_modificar_ordemExec);
    })
    .catch((erro) => {
      showAPIErrorAndAlert(erro, erro_modificar_ordemExec);
    });
};

export const incrementarPrecoOrdemExecAPI = async (id, preco) => {
  return api
    .put(`${url_aumentarPreco_id_valor}${id}/${preco}`, {
      timeout,
    })
    .then(() => {
      timedAlert(sucesso_modificar_ordemExec);
    })
    .catch((erro) => {
      showAPIErrorAndAlert(erro, erro_modificar_ordemExec);
    });
};

export const pesquisarListaStrikeTHLAPI = async (ativo) => {
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
      showAPIErrorAndAlert(erro, erro_pesquisar_ativo);
      return [];
    });
};

export const getTHLDataWithStrikeAPI = async (ativo, strike, tipo) => {
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
      showAPIErrorAndAlert(erro, erro_listarTHL_thl);
      return [];
    });
};

export const getTHLInitialDataAPI = async (symbol, type) => {
  return api
    .get(`${url_listarTabelaInicialTHL_ativo_strike_tipo}${symbol}/${type}`, {
      timeout,
      "axios-retry": {
        retries: 3,
        retryDelay: () => 2000,
      },
    })
    .then((response) => {
      return response.data;
    })
    .catch((erro) => {
      showAPIErrorAndAlert(erro, erro_listarTHL_thl);
      return { lines: [], structures: [] };
    });
};

export const recalcularPrecosTHLAPI = async (
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
      showAPIErrorAndAlert(erro, "");
      return [];
    });
};

export const pesquisarCombinacoesTHLAPI = async (ativo) => {
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
      showAPIErrorAndAlert(erro, erro_pesquisarCombinacoes_thl);
      return [];
    });
};

export const favoritarTHLAPI = async (data) => {
  return api
    .post(`${url_favoritarTHL_}`, data, {
      timeout,
    })
    .then(() => timedAlert(sucesso_favoritar_thl))
    .catch((erro) => {
      showAPIErrorAndAlert(erro, erro_favoritar_thl);
    });
};

export const addBoxStructureAPI = async (groupName, data) => {
  return api
    .post(`${url_addQuoteBox_groupName}${groupName}`, data, {
      timeout,
    })
    .then((response) => {
      timedAlert(success_add_box);

      return response.data;
    })
    .catch((error) => {
      showAPIErrorAndAlert(error, error_add_box);
    });
};

export const listQuoteBoxesAPI = async () => {
  return api
    .get(url_box)
    .then((response) => response.data)
    .catch((error) => {
      showAPIErrorAndAlert(error, "");
      return [];
    });
};

export const deleteQuoteBoxAPI = async (boxID) => {
  return api
    .delete(`${url_box}/${boxID}`)
    .then(() => true)
    .catch((error) => {
      showAPIErrorAndAlert(error, error_delete_box);
      return false;
    });
};

export const listAlertsAPI = async () => {
  return api
    .get(url_listarAlertas)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.log(error);

      return [];
    });
};

export const updateAlertAPI = async (id, payload) => {
  return api
    .put(`advice/${id}`, payload)
    .then((response) => ({ data: response.data, success: true }))
    .catch((error) => {
      showAPIErrorAndAlert(error, error_delete_alert);
      return { data: null, success: false };
    });
};

export const getMultilegExecStrategiesAPI = async () => {
  return api
    .get("execucao")
    .then((response) => {
      if (response.data && response.data.length) {
        return response.data;
      }

      return [];
    })
    .catch((error) => {
      return [];
    });
};

export const saveBoxPositionsAPI = async (payload) => {
  return api
    .put(url_createPositionBox, payload)
    .then((response) => {
      if (response.data && Array.isArray(response.data)) {
        return response.data;
      }

      return [];
    })
    .catch((error) => {
      return [];
    });
};

export const createBoxAlertAPI = async (payload) => {
  return api
    .post(url_createBoxAlert, payload)
    .then((response) => {
      if (response.data && Array.isArray(response.data)) {
        return response.data;
      }

      return [];
    })
    .catch((error) => {
      return [];
    });
};

export const listBoxPositionAPI = async () => {
  return api
    .get(url_listPositionBox)
    .then((response) => {
      if (response.data && Array.isArray(response.data)) {
        return response.data;
      }

      return [];
    })
    .catch((error) => {
      return [];
    });
};

export const setPointerWhileAwaiting = ({
  lockMode,
  id,
  parentID = "menusTelaPrincipal",
}) => {
  const parent =
    parentID === "menusTelaPrincipal"
      ? document.getElementById(parentID)
      : document.body;

  const element = document.getElementById(id);

  if (lockMode === "travar") {
    if (element) {
      element.style.pointerEvents = "none";
    }
    if (parent) parent.style.cursor = "wait";
  }
  if (lockMode === "destravar") {
    if (element) {
      element.style.pointerEvents = "all";
    }
    if (parent) parent.style.cursor = "auto";
  }
};

export const showAPIErrorAndAlert = (erro, mensagem) => {
  console.log(erro);
  console.log(erro.response);
  if (erro.timeout) {
    alert(erro_timeout);
  } else if (mensagem) alert(mensagem);
};

const timedAlert = (message) => {
  setTimeout(() => {
    alert(message);
  }, 1);
};
