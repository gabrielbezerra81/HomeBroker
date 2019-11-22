import request from "superagent";
import {
  url_base,
  url_pesquisarAtivoBoletas_codigo,
  url_listarBookOfertas_codigo,
  url_enviarOrdem,
  url_pesquisarOpcoesVencimentos_codigo,
  url_pesquisarStrikes_codigo_vencimento,
  url_listarOrdensExecucao_,
  url_listarPosicoes,
  url_emblemaReativo_ids,
  url_base_reativa,
  url_bookReativo_codigos,
  url_cotacaoReativa_codigos,
  url_listarAtivosMonitorados_,
  url_monitorarAtivo_codigo,
  url_criarPosicaoMultileg_,
  url_criarAlertaOperacao_,
  url_cancelarOrdemExec_id,
  url_finalizarAMercado_id,
  url_aumentarQtde_id_qtde,
  url_aumentarPreco_id_valor,
  url_realizarLogin_usuario_senha,
  url_autenticacao_token,
  url_informacoesUsuario_token,
  url_realizarCadastro_dados,
  url_ordensExecReativas_idUser,
  url_posicaoReativa_idUser
} from "components/api/url";
import {
  MODIFICAR_ATRIBUTO_ABA,
  MUDAR_VARIAVEL_POSICAO_CUSTODIA
} from "constants/MenuActionTypes";
import {
  LISTAR_BOOK_OFERTAS,
  PESQUISAR_ATIVO_BOLETA_API,
  ATUALIZAR_SOURCE_EVENT_MULTILEG,
  LISTAR_ORDENS_EXECUCAO
} from "constants/ApiActionTypes";
import { formatarDataDaAPI } from "components/utils/Formatacoes";
import { atualizarTabelaAntiga } from "components/redux/actions/api_actions/bookOfertaAPIActions";
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
  erro_realizar_login,
  erro_realizar_cadastro
} from "constants/AlertaErros";
import { calculoPreco } from "components/forms/multileg_/CalculoPreco";
import { formatarNumero } from "components/redux/reducers/formInputReducer";
import {
  adicionaPosicao,
  atualizarEmblemas
} from "components/redux/actions/menu_actions/PosicaoActions";

export const pesquisarAtivoAPI = codigo => {
  return request
    .get(url_base + url_pesquisarAtivoBoletas_codigo + codigo)
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
      alert(erro_pesquisar_ativo);
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
    .get(url_base + url_listarBookOfertas_codigo + codigo_ativo)
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
    .post(url_base + url_enviarOrdem)
    .retry(2)
    .set({ "Content-Type": "application/json" })
    .send(jsonStringBody)
    .then(response => {
      if (response.status === 201) alert(sucesso_enviar_ordem);
      else alert(erro_enviar_ordem);
    })
    .catch(erro => {
      console.log(erro.response);
      alert(erro_enviar_ordem);
    });
};

export const pesquisarAtivoMultilegAPI = codigo_ativo => {
  var dados;

  return request
    .get(url_base + url_pesquisarOpcoesVencimentos_codigo + codigo_ativo)
    .retry(3)
    .then(async response => {
      dados = {
        opcoes: [],
        vencimentos: [],
        //cotacaoAtual: 0,
        variacao: "",
        cotacaoAtual: 0,
        ativoPrincipal: ""
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
    .catch(erro => {
      alert(erro_pesquisar_ativo);
      console.log(erro);
      return dados;
    });
};

export const pesquisarStrikesMultilegAPI = (codigo_ativo, vencimento) => {
  return request
    .get(
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
    .get(url_base + url_listarOrdensExecucao_)
    .retry(3)
    .then(response => {
      const { body } = response;
      let ofertas = [];

      body.forEach(oferta => {
        ofertas.push(oferta);
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
    .get(url_base + url_listarPosicoes)
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

export const atualizarOrdensExecAPI = (
  dispatch,
  idUsuario,
  listaOrdensExec,
  props
) => {
  var source = new EventSource(
    url_base_reativa + url_ordensExecReativas_idUser + idUsuario
  );

  source.onopen = function(event) {
    console.log("open");
  };

  source.onmessage = function(event) {
    if (typeof event.data !== "undefined") {
      var dados = JSON.parse(event.data);

      const indice = listaOrdensExec.findIndex(ordem => ordem.id === dados.id);

      const novaTabela = [...listaOrdensExec];
      if (indice !== -1) {
        novaTabela[indice] = dados;
        dispatch({ type: LISTAR_ORDENS_EXECUCAO, payload: novaTabela });
      } else {
        novaTabela.unshift(dados);

        dispatch({ type: LISTAR_ORDENS_EXECUCAO, payload: novaTabela });
      }
    }
  };

  return source;
};

export const atualizarBookAPI = (dispatch, props, codigos, tipo, multileg) => {
  var source = new EventSource(
    url_base_reativa + url_bookReativo_codigos + codigos
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
    url_base_reativa + url_cotacaoReativa_codigos + codigos
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
          if (permitirDispatch) {
            let calculo = calculoPreco(aba, "ultimo").toFixed(2);

            calculo = formatarNumero(calculo, 2, ".", ",");
            aba.preco = calculo;
          }
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
  var source = new EventSource(url_base_reativa + url_emblemaReativo_ids + ids);

  source.onopen = function(event) {
    console.log("open");
  };

  source.onmessage = function(event) {
    if (typeof event.data !== "undefined") {
      var dados = JSON.parse(event.data);
      listaPosicoes = [...listaPosicoes];

      const posicao = listaPosicoes.filter(
        posicao => posicao.idEstrutura === dados.id
      );

      if (posicao.length > 0) {
        posicao[0].precoCompra = dados.min;
        posicao[0].precoVenda = dados.max;
        posicao[0].cotacaoAtual = dados.last;

        dispatch({
          type: MUDAR_VARIAVEL_POSICAO_CUSTODIA,
          payload: { nome: "posicoesCustodia", valor: listaPosicoes }
        });
      }
    }
  };

  return source;
};

export const atualizarPosicaoAPI = (dispatch, listaPosicoes, idUsuario) => {
  var source = new EventSource(
    url_base_reativa + url_posicaoReativa_idUser + idUsuario
  );

  source.onopen = function(event) {
    console.log("open");
  };

  source.onmessage = function(event) {
    if (typeof event.data !== "undefined") {
      var grupoPosicao = JSON.parse(event.data);
      listaPosicoes = [...listaPosicoes];

      const listaFiltrada = listaPosicoes.filter(
        posicao =>
          posicao.agrupadorPrincipal === grupoPosicao.agrupadorPrincipal
      );

      if (listaFiltrada.length > 0) {
        const posicao = listaFiltrada[0];
        const posicaoAtualizada = adicionaPosicao(grupoPosicao)[0];
        posicaoAtualizada.precoCompra = posicao.precoCompra;
        posicaoAtualizada.precoVenda = posicao.precoVenda;
        posicaoAtualizada.cotacaoAtual = posicao.cotacaoAtual;

        dispatch({
          type: MUDAR_VARIAVEL_POSICAO_CUSTODIA,
          payload: { nome: "posicoesCustodia", valor: listaPosicoes }
        });
      } else {
        const novaPosicao = adicionaPosicao(grupoPosicao);
        listaPosicoes.push(...novaPosicao);
        dispatch({
          type: MUDAR_VARIAVEL_POSICAO_CUSTODIA,
          payload: { nome: "posicoesCustodia", valor: listaPosicoes }
        });
      }
    }
  };

  return source;
};

export const verificarMonitorarAtivoAPI = codigo => {
  request
    .get(url_base + url_listarAtivosMonitorados_)
    .then(response => {
      const { body } = response;

      if (!body.some(item => item.symbol === codigo)) {
        request
          .get(url_base + url_monitorarAtivo_codigo + codigo)
          .then(() => console.log("adicionou"))
          .catch(erro => {
            console.log(erro);
          });
      }
    })
    .catch(erro => {
      console.log(erro);
    });
};

export const criarPosicaoMultilegAPI = json => {
  const jsonStringBody = JSON.stringify(json);

  return request
    .post(url_base + url_criarPosicaoMultileg_)
    .retry(2)
    .set({ "Content-Type": "application/json" })
    .send(jsonStringBody)
    .then(response => {
      console.log("response", response);
      if (response.status === 201) alert(sucesso_criar_posicao);
      else alert(erro_criar_posicao);
    })
    .catch(erro => {
      console.log(erro.response);
      alert(erro_criar_posicao);
    });
};

export const criarAlertaOperacaoAPI = json => {
  const jsonStringBody = JSON.stringify(json);

  return request
    .post(url_base + url_criarAlertaOperacao_)
    .retry(2)
    .set({ "Content-Type": "application/json" })
    .send(jsonStringBody)
    .then(response => {
      console.log("response", response);
      if (response.status === 201) alert(sucesso_criar_alerta);
      else alert(erro_criar_alerta);
    })
    .catch(erro => {
      console.log(erro.response);
      alert(erro_criar_alerta);
    });
};

export const cancelarOrdemExecAPI = id => {
  return request
    .get(url_base + url_cancelarOrdemExec_id + id)
    .then(() => {
      alert(sucesso_cancelar_ordem);
    })
    .catch(erro => {
      console.log(erro);
      alert(erro_cancelar_ordem);
    });
};

export const finalizarAMercadoAPI = id => {
  return request
    .get(url_base + url_finalizarAMercado_id + id)
    .then(() => {
      alert(sucesso_finalizar_a_mercado);
    })
    .catch(erro => {
      console.log(erro);
      alert(erro_finalizar_a_mercado);
    });
};

export const incrementarQtdeOrdemExecAPI = (id, qtde) => {
  return request
    .get(url_base + url_aumentarQtde_id_qtde + id + "/" + qtde)
    .then(() => {
      alert(sucesso_modificar_ordemExec);
    })
    .catch(erro => {
      console.log(erro);
      alert(erro_modificar_ordemExec);
    });
};

export const incrementarPrecoOrdemExecAPI = (id, preco) => {
  return request
    .get(url_base + url_aumentarPreco_id_valor + id + "/" + preco)
    .then(() => {
      alert(sucesso_modificar_ordemExec);
    })
    .catch(erro => {
      console.log(erro);
      alert(erro_modificar_ordemExec);
    });
};

export const realizarLoginAPI = (username, password) => {
  let payload = { username: username, password: password };

  return request
    .post(url_base + url_realizarLogin_usuario_senha)
    .set({ "Content-Type": "application/json" })
    .send(JSON.stringify(payload))
    .then(response => {
      const { body } = response;
      return body;
    })
    .catch(erro => {
      console.log(erro);
      alert(erro_realizar_login);
      return null;
    });
};

export const realizarCadastroAPI = (nome, username, email, role, password) => {
  let payload = {
    name: nome,
    username: username,
    email: email,
    role: role,
    password: password
  };

  return request
    .post(url_base + url_realizarCadastro_dados)
    .set({ "Content-Type": "application/json" })
    .send(JSON.stringify(payload))
    .then(() => {
      return true;
    })
    .catch(erro => {
      console.log(erro);
      alert(erro_realizar_cadastro);
      return false;
    });
};

export const autenticacaoTokenAPI = token => {
  return request
    .get(url_base + url_autenticacao_token)
    .set({ Authorization: `${token.tokenType} ${token.accessToken}` })
    .then(response => {
      return response.body;
    })
    .catch(erro => {
      console.log(erro);
      alert(erro_realizar_login);
      return null;
    });
};

export const buscarInformacoesUsuarioAPI = token => {
  return request
    .get(url_base + url_informacoesUsuario_token)
    .set({ Authorization: `${token.tokenType} ${token.accessToken}` })
    .then(response => {
      return response.body;
    })
    .catch(erro => {
      console.log(erro);
      alert(erro_realizar_login);
      return null;
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
