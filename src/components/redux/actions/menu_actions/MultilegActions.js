import {
  ABRIR_FECHAR_CONFIG_COMPLEMENTAR,
  ADICIONAR_ABA,
  SELECIONAR_ABA,
  MODIFICAR_ATRIBUTO_ABA,
  MODIFICAR_VARIAVEL_MULTILEG
} from "constants/MenuActionTypes";
import { cloneDeep } from "lodash";
import {
  pesquisarStrikesMultilegAction,
  encontrarNumMaisProximo
} from "components/redux/actions/api_actions/MenuAPIAction";
import {
  listarBookOfertaAPI,
  pesquisarAtivoAPI,
  atualizarCotacaoAPI,
  atualizarBookAPI,
  travarDestravarClique
} from "components/api/API";
import { calculoPreco } from "components/forms/multileg_/CalculoPreco";
import { formatarNumero } from "components/redux/reducers/formInputReducer";
import { ATUALIZAR_SOURCE_EVENT_MULTILEG } from "constants/ApiActionTypes";
import { erro_validar_qtde } from "constants/AlertaErros";
import { getformatedDate } from "components/utils/Formatacoes";

export const abrirFecharConfigComplAction = configComplementarAberto => {
  return dispatch => {
    dispatch({
      type: ABRIR_FECHAR_CONFIG_COMPLEMENTAR,
      payload: !configComplementarAberto
    });
  };
};

export const selecionarAdicionarAbaAction = (key, props) => {
  return dispatch => {
    if (key === "adicionar") {
      let abasMultileg = [...props.multileg];

      const novaAba = cloneDeep(aba);
      novaAba.nomeAba = "Ordem " + (abasMultileg.length + 1);
      let abaAtual = "tab" + abasMultileg.length;

      abasMultileg.push(novaAba);

      //atualizarCotacaoAction(dispatch, props, abasMultileg);
      atualizarBookAction(dispatch, props, abasMultileg);
      dispatch({
        type: ADICIONAR_ABA,
        payload: { multileg: abasMultileg, abaSelecionada: abaAtual }
      });
    } else {
      dispatch({
        type: SELECIONAR_ABA,
        payload: key
      });
    }
  };
};

export const excluirAbaMultilegAction = (props, indiceAba) => {
  return dispatch => {
    let abasMultileg = [...props.multileg];

    if (indiceAba > 0) {
      const key = "tab" + (indiceAba - 1);
      dispatch({
        type: SELECIONAR_ABA,
        payload: key
      });
    }

    abasMultileg.splice(indiceAba, 1);

    if (props.eventSource) props.eventSource.close();
    if (props.eventSourceCotacao) props.eventSourceCotacao.close();
    dispatch({ type: MODIFICAR_ATRIBUTO_ABA, payload: abasMultileg });
    atualizarCotacaoAction(dispatch, props, abasMultileg);
    atualizarBookAction(dispatch, props, abasMultileg);
  };
};

export const modificarAtributoAbaAction = (
  multileg,
  indice,
  atributo,
  valor
) => {
  return async dispatch => {
    let abasMultileg = [...multileg];

    if (atributo === "limpar") {
      abasMultileg[indice] = cloneDeep(aba);
      abasMultileg[indice].nomeAba = "Sim " + (indice + 1);
    } else {
      if (atributo === "ativo") valor = valor.toUpperCase();

      abasMultileg[indice][atributo] = valor;

      if (atributo === "vencimentoSelecionado") {
        const dados = await pesquisarStrikesMultilegAction(
          multileg[indice].ativo,
          multileg[indice].vencimentoSelecionado
        );
        if (dados) {
          abasMultileg[indice].opcoes = [...dados];
          abasMultileg[indice].strikeSelecionado = encontrarNumMaisProximo(
            dados,
            abasMultileg[indice].valor
          );
        }
      }
    }

    dispatch({ type: MODIFICAR_ATRIBUTO_ABA, payload: abasMultileg });
  };
};

export const modificarAtributoTabelaAbaAction = (
  props,
  indiceGeral,
  atributo,
  valor,
  indiceLinha
) => {
  return async dispatch => {
    travarDestravarClique("travar", "multileg");
    let abasMultileg = [...props.multileg];
    let linhaTabela = abasMultileg[indiceGeral].tabelaMultileg[indiceLinha];

    if (atributo === "tipo") {
      if (valor === "call") linhaTabela[atributo] = "put";
      else if (valor === "put") linhaTabela[atributo] = "call";
      pesquisarSymbolModel_strike_tipo(linhaTabela);
    } //
    else {
      linhaTabela[atributo] = valor;
      //Se a série for alterada, pesquisa novamente os strikes e códigos
      if (atributo === "serieSelecionada") {
        const dados = await pesquisarStrikesMultilegAction(
          linhaTabela.ativoAtual,
          valor
        );
        if (dados) {
          linhaTabela.opcoes = [...dados];
          const pesquisa = linhaTabela.opcoes.find(
            item => item.strike === linhaTabela.strikeSelecionado
          );
          if (!pesquisa) {
            linhaTabela.strikeSelecionado = encontrarNumMaisProximo(
              dados,
              linhaTabela.cotacao
            );
          }
          dispatch({ type: MODIFICAR_ATRIBUTO_ABA, payload: abasMultileg });
        }
      } //
      else if (atributo === "strikeSelecionado") {
        pesquisarSymbolModel_strike_tipo(linhaTabela);
      } //
      else if (atributo === "codigoSelecionado") {
        pesquisarSerieStrikeModeloTipo_symbol(linhaTabela);
      } //
    }
    const aba = abasMultileg[indiceGeral];
    let calculo = calculoPreco(aba, "ultimo")
      .toFixed(2)
      .toString();

    calculo = formatarNumero(calculo, 2, ".", ",");
    aba.preco = calculo;

    // atualizarBookAction(dispatch, props, abasMultileg);
    // atualizarCotacaoAction(dispatch, props, abasMultileg);
    // pesquisarAtivoAPI(linhaTabela.codigoSelecionado);
    if (atributo !== "serieSelecionada")
      dispatch({ type: MODIFICAR_ATRIBUTO_ABA, payload: abasMultileg });
    travarDestravarClique("destravar", "multileg");
  };
};

export const modificarVariavelAction = (nome, valor) => {
  return dispatch => {
    dispatch({
      type: MODIFICAR_VARIAVEL_MULTILEG,
      payload: { nome: nome, valor: valor }
    });
  };
};

export const excluirOfertaTabelaAction = (props, indiceAba, indiceLinha) => {
  return dispatch => {
    let abasMultileg = [...props.multileg];
    abasMultileg[indiceAba].tabelaMultileg.splice(indiceLinha, 1);

    atualizarBookAction(dispatch, props, abasMultileg);
    atualizarCotacaoAction(dispatch, props, abasMultileg);
    dispatch({ type: MODIFICAR_ATRIBUTO_ABA, payload: abasMultileg });
  };
};

export const adicionarOfertaTabelaAction = (props, tipoOferta) => {
  return async dispatch => {
    travarDestravarClique("travar", "multileg");

    let abasMultileg = [...props.multileg];
    const indiceAba = props.indice;
    let novaOferta = cloneDeep(oferta);
    novaOferta.cotacao = abasMultileg[indiceAba].valor;
    novaOferta.ativoAtual = abasMultileg[indiceAba].ativoAtual;

    if (tipoOferta === "acao") {
      novaOferta.opcoes = [{ symbol: abasMultileg[indiceAba].ativoAtual }];
      novaOferta.codigoSelecionado = abasMultileg[indiceAba].ativoAtual;
    } else {
      novaOferta.strikeSelecionado = abasMultileg[indiceAba].strikeSelecionado;
      novaOferta.serie = [...abasMultileg[indiceAba].vencimento];
      novaOferta.serieSelecionada =
        abasMultileg[indiceAba].vencimentoSelecionado;
      novaOferta.opcoes = [...abasMultileg[indiceAba].opcoes];

      if (tipoOferta === "call") {
        novaOferta.tipo = "call";
      } else if (tipoOferta === "put") {
        novaOferta.tipo = "put";
      }
      pesquisarSymbolModel_strike_tipo(novaOferta);
      const dadosAtivo = await pesquisarAtivoAPI(novaOferta.codigoSelecionado);
      if (dadosAtivo) {
        novaOferta.cotacao = Number(dadosAtivo.cotacaoAtual);
      }
    }
    const book = await listarBookOfertaAPI(novaOferta.codigoSelecionado);

    if (book) {
      novaOferta.venda =
        book.tabelaOfertasVenda[book.tabelaOfertasVenda.length - 1];
      novaOferta.compra = book.tabelaOfertasCompra[0];

      abasMultileg[indiceAba].tabelaMultileg.push(novaOferta);

      const aba = abasMultileg[indiceAba];
      aba.preco = calculoPreco(aba, "ultimo").toFixed(2);

      atualizarBookAction(dispatch, props, abasMultileg);
      atualizarCotacaoAction(dispatch, props, abasMultileg);
      dispatch({ type: MODIFICAR_ATRIBUTO_ABA, payload: abasMultileg });
      travarDestravarClique("destravar", "multileg");
    }
  };
};

export const atualizarBookAction = (dispatch, props, multileg) => {
  if (props.eventSource) {
    props.eventSource.close();
  }

  let abasMultileg = multileg;
  let codigos = "";

  abasMultileg.forEach(aba => {
    aba.tabelaMultileg.forEach(oferta => {
      codigos += oferta.codigoSelecionado + ",";
    });
  });

  codigos = codigos.substring(0, codigos.length - 1);

  const newSource = atualizarBookAPI(
    dispatch,
    props,
    codigos,
    "multileg",
    abasMultileg
  );
  dispatch({
    type: ATUALIZAR_SOURCE_EVENT_MULTILEG,
    payload: newSource,
    nomeVariavel: "eventSource"
  });
};

const oferta = {
  opcoes: [],
  strikeSelecionado: "",
  cv: "compra",
  qtde: 0,
  serie: [],
  serieSelecionada: "",
  codigoSelecionado: "",
  tipo: "",
  modelo: "",
  despernamento: 1000,
  prioridade: 0,
  cotacao: 0,
  ativoAtual: "",
  compra: {},
  venda: {}
};

const aba = {
  nomeAba: "",
  ativo: "",
  ativoAtual: "",
  valor: 0,
  variacao: 0,
  opcoes: [],
  strikeSelecionado: "",
  vencimento: [],
  vencimentoSelecionado: "",
  preco: "",
  total: "",
  validadeSelect: "DAY",
  date: new Date(),
  tabelaMultileg: []
};

const pesquisarSymbolModel_strike_tipo = objeto => {
  objeto.opcoes.forEach(item => {
    if (
      item.strike === objeto.strikeSelecionado &&
      item.type === objeto.tipo.toUpperCase()
    ) {
      objeto.codigoSelecionado = item.symbol;
      objeto.modelo = item.model;
      return;
    }
  });
};

const pesquisarSerieStrikeModeloTipo_symbol = objeto => {
  objeto.opcoes.forEach(item => {
    if (item.symbol === objeto.codigoSelecionado) {
      objeto.modelo = item.model;
      objeto.tipo = item.type.toLowerCase();
      objeto.strikeSelecionado = item.strike;
      objeto.serieSelecionada = item.strikeSelecionado;

      return;
    }
  });
};

// export const atualizarCotacaoAction = (props, multileg) => {
//   return dispatch => {
//     if (props.eventSourceCotacao) {
//       console.log("fechou");
//       props.eventSourceCotacao.close();
//     }
//     let codigos = "";
//     const abasMultileg = [...multileg];

//     abasMultileg.forEach(aba => {
//       if (!codigos.includes(aba.ativoAtual)) codigos += aba.ativoAtual + ",";

//       aba.tabelaMultileg.forEach(oferta => {
//         if (!codigos.includes(oferta.codigoSelecionado))
//           codigos += oferta.codigoSelecionado + ",";
//       });
//     });

//     codigos = codigos.substring(0, codigos.length - 1);

//     atualizarCotacaoAPI(dispatch, props, codigos, "multileg", abasMultileg);
//   };
// };

export const validarOrdemMultileg = props => {
  let abaMultileg = [...props.multileg][props.indice];
  let valido = true;

  abaMultileg.tabelaMultileg.forEach((oferta, index) => {
    if (oferta.qtde === 0) {
      valido = false;
      alert(erro_validar_qtde);
    }
  });

  return valido;
};

export const montarOrdemMultileg = props => {
  let abaMultileg = [...props.multileg][props.indice];

  let json = {
    account: {},
    tradeName: {},
    offers: [],
    next: []
  };
  json.account.id = 1;
  json.enabled = true;
  json.multiStocks = true;
  if (abaMultileg.validadeSelect === "DAY")
    json.expiration = getformatedDate(new Date()) + " 22:00:00";
  else {
    json.expiration = abaMultileg.date.toLocaleString("pt-BR");
  }
  json.status = "Nova";
  json.priority = 0;
  json.tradeName.name = "Multileg";

  abaMultileg.tabelaMultileg.forEach((oferta, index) => {
    let ofertaPrincipal = {
      stock: {}
    };

    ofertaPrincipal.stock.symbol = oferta.codigoSelecionado;
    ofertaPrincipal.limit = oferta.despernamento;
    ofertaPrincipal.qtty = oferta.qtde;
    ofertaPrincipal.priority = Number(oferta.prioridade);
    ofertaPrincipal.offerType = oferta.cv.charAt(0).toUpperCase();
    //ofertaPrincipal.orderType = "multileg";
    if (ofertaPrincipal.offerType === "C") ofertaPrincipal.orderType = "buy";
    else if (ofertaPrincipal.offerType === "V")
      ofertaPrincipal.orderType = "sell";

    if (abaMultileg.validadeSelect === "DAY")
      ofertaPrincipal.expiration = getformatedDate(new Date()) + " 22:00:00";
    else {
      ofertaPrincipal.expiration = abaMultileg.date.toLocaleString("pt-BR");
    }

    ofertaPrincipal.price = Number(
      abaMultileg.preco
        .split(".")
        .join("")
        .replace(",", ".")
    );
    ofertaPrincipal.expirationType = abaMultileg.validadeSelect;

    json.offers.push(ofertaPrincipal);
  });
  return json;
};

//Formato antigo
export const atualizarCotacaoAction = (dispatch, props, multileg) => {
  if (props.eventSourceCotacao) {
    props.eventSourceCotacao.close();
  }
  let abasMultileg = multileg;
  let codigos = "";

  abasMultileg.forEach(aba => {
    if (!codigos.includes(aba.ativoAtual)) codigos += aba.ativoAtual + ",";

    aba.tabelaMultileg.forEach(oferta => {
      if (!codigos.includes(oferta.codigoSelecionado))
        codigos += oferta.codigoSelecionado + ",";
    });
  });

  codigos = codigos.substring(0, codigos.length - 1);

  const newSource = atualizarCotacaoAPI(
    dispatch,
    props,
    codigos,
    "multileg",
    abasMultileg
  );
  dispatch({
    type: ATUALIZAR_SOURCE_EVENT_MULTILEG,
    payload: newSource,
    nomeVariavel: "eventSourceCotacao"
  });
};

//Formato novo
// export const atualizarBookAction = (props, multileg) => {
//   return dispatch => {
//     if (props.eventSource) {
//       console.log("fechou");
//       props.eventSource.close();
//     }
//     let codigos = "";
//     const abasMultileg = [...multileg];

//     abasMultileg.forEach(aba => {
//       aba.tabelaMultileg.forEach(oferta => {
//         codigos += oferta.codigoSelecionado + ",";
//       });
//     });

//     codigos = codigos.substring(0, codigos.length - 1);

//     const newSource = atualizarBookAPI(
//       dispatch,
//       props,
//       codigos,
//       "multileg",
//       abasMultileg
//     );
//   };
// };
