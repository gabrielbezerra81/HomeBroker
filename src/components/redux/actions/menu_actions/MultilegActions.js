import { cloneDeep } from "lodash";
import {
  ABRIR_FECHAR_CONFIG_COMPLEMENTAR,
  ADICIONAR_ABA,
  SELECIONAR_ABA,
  MODIFICAR_ATRIBUTO_ABA,
  MODIFICAR_VARIAVEL_MULTILEG
} from "constants/MenuActionTypes";
import {
  pesquisarStrikesMultilegAction,
  encontrarNumMaisProximo
} from "components/redux/actions/api_actions/MenuAPIAction";
import {
  listarBookOfertaAPI,
  pesquisarAtivoAPI,
  atualizarCotacaoAPI,
  atualizarBookAPI,
  travarDestravarClique,
  verificarMonitorarAtivoAPI
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

////

export const selecionarAdicionarAbaAction = (key, props) => {
  return dispatch => {
    if (key === "adicionar") {
      let multileg = adicionarAba(props);
      dispatch({
        type: ADICIONAR_ABA,
        payload: {
          multileg: multileg.abasMultileg,
          abaSelecionada: multileg.abaAtual
        }
      });
    } else {
      dispatch({
        type: SELECIONAR_ABA,
        payload: key
      });
    }
  };
};

export const adicionarAba = props => {
  let abasMultileg = [...props.multileg];

  const novaAba = cloneDeep(aba);
  novaAba.nomeAba = "Ordem " + (abasMultileg.length + 1);
  let abaAtual = "tab" + abasMultileg.length;

  abasMultileg.push(novaAba);

  return { abasMultileg: abasMultileg, abaAtual: abaAtual };
};

////

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

    dispatch({ type: MODIFICAR_ATRIBUTO_ABA, payload: abasMultileg });
  };
};

////

export const modificarAtributoAbaAction = (
  multileg,
  indice,
  atributo,
  valor,
  props = null
) => {
  return async dispatch => {
    const dados = await modificarAba(multileg, indice, atributo, valor, props);
    dispatch({ type: MODIFICAR_ATRIBUTO_ABA, payload: dados.abasMultileg });
    if (dados.cotacoesMultileg)
      dispatch({
        type: MODIFICAR_VARIAVEL_MULTILEG,
        payload: { nome: "cotacoesMultileg", valor: dados.cotacoesMultileg }
      });
  };
};

export const modificarAba = async (
  multileg,
  indice,
  atributo,
  valor,
  props = null
) => {
  let abasMultileg = [...multileg];
  let cotacoesMultileg;

  if (atributo === "limpar") {
    abasMultileg[indice] = cloneDeep(aba);
    abasMultileg[indice].nomeAba = "Ordem " + (indice + 1);
  } else {
    if (atributo === "ativo") valor = valor.toUpperCase();

    abasMultileg[indice][atributo] = valor;

    if (atributo === "vencimentoSelecionado") {
      cotacoesMultileg = [...props.cotacoesMultileg];
      const codigo = multileg[indice].ativoAtual;
      multileg[indice].ativo = codigo;

      if (!verificaCotacaoJaAdd(cotacoesMultileg, codigo)) {
        const dadosAtivo = await pesquisarAtivoAPI(codigo);
        var cotacao = dadosAtivo.cotacaoAtual;
        adicionaCotacoesMultileg(cotacoesMultileg, codigo, cotacao);
      }

      const dados = await pesquisarStrikesMultilegAction(
        codigo,
        multileg[indice].vencimentoSelecionado
      );
      if (dados) {
        abasMultileg[indice].opcoes = [...dados];
        abasMultileg[indice].strikeSelecionado = encontrarNumMaisProximo(
          dados,
          abasMultileg[indice].strikeSelecionado
        );
      }
    }
  }
  return { abasMultileg, cotacoesMultileg };
};

////

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
    let cotacoesMultileg = props.cotacoesMultileg;

    const codigoAnterior = linhaTabela.codigoSelecionado;

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
          const cotacaoAnterior = cotacoesMultileg.find(
            cotacao => cotacao.codigo === codigoAnterior
          );

          if (!pesquisa) {
            linhaTabela.strikeSelecionado = encontrarNumMaisProximo(
              dados,
              linhaTabela.strikeSelecionado //todo
            );
          }
          pesquisarSymbolModel_strike_tipo(linhaTabela);
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

    if (codigoAnterior !== linhaTabela.codigoSelecionado) {
      verificarMonitorarAtivoAPI(linhaTabela.codigoSelecionado);
      //Se o código mudar, deve ser verificado se o novo código já está presente nos books
      const booksMultileg = [...props.booksMultileg];
      cotacoesMultileg = [...props.cotacoesMultileg];

      AdicionaCodigoBooksMultileg(booksMultileg, linhaTabela.codigoSelecionado);
      adicionaCotacoesMultileg(cotacoesMultileg, linhaTabela.codigoSelecionado);
      dispatch({
        type: MODIFICAR_VARIAVEL_MULTILEG,
        payload: { nome: "booksMultileg", valor: booksMultileg }
      });
      dispatch({
        type: MODIFICAR_VARIAVEL_MULTILEG,
        payload: { nome: "cotacoesMultileg", valor: cotacoesMultileg }
      });
      atualizarCotacaoAction(dispatch, props, cotacoesMultileg);
      atualizarBookAction(dispatch, props, booksMultileg);
    }
    const aba = abasMultileg[indiceGeral];
    let calculo = calculoPreco(aba, "ultimo", [], cotacoesMultileg).toFixed(2);

    calculo = formatarNumero(calculo, 2, ".", ",");
    aba.preco = calculo;

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

    dispatch({ type: MODIFICAR_ATRIBUTO_ABA, payload: abasMultileg });
  };
};

////

export const adicionarOfertaTabelaAction = (props, tipoOferta) => {
  return async dispatch => {
    travarDestravarClique("travar", "multileg");
    const dados = await adicionarOferta(
      props.multileg,
      tipoOferta,
      props.indice,
      props.booksMultileg,
      props.cotacoesMultileg
    );

    atualizarBookAction(dispatch, props, dados.booksMultileg);
    atualizarCotacaoAction(dispatch, props, dados.cotacoesMultileg);
    dispatch({ type: MODIFICAR_ATRIBUTO_ABA, payload: dados.abasMultileg });
    dispatch({
      type: MODIFICAR_VARIAVEL_MULTILEG,
      payload: { nome: "booksMultileg", valor: dados.booksMultileg }
    });
    dispatch({
      type: MODIFICAR_VARIAVEL_MULTILEG,
      payload: { nome: "cotacoesMultileg", valor: dados.cotacoesMultileg }
    });

    travarDestravarClique("destravar", "multileg");
  };
};

export const adicionarOferta = async (
  multileg,
  tipoOferta,
  indice,
  booksMultileg,
  cotacoesMultileg
) => {
  let abasMultileg = [...multileg];
  booksMultileg = [...booksMultileg];
  cotacoesMultileg = [...cotacoesMultileg];

  const indiceAba = indice;
  let novaOferta = cloneDeep(oferta);
  let cotacao = 0;

  novaOferta.ativoAtual = abasMultileg[indiceAba].ativoAtual;

  if (tipoOferta === "acao") {
    novaOferta.opcoes = [{ symbol: abasMultileg[indiceAba].ativoAtual }];
    novaOferta.codigoSelecionado = abasMultileg[indiceAba].ativoAtual;
  } else {
    novaOferta.strikeSelecionado = abasMultileg[indiceAba].strikeSelecionado;
    novaOferta.serie = [...abasMultileg[indiceAba].vencimento];
    novaOferta.serieSelecionada = abasMultileg[indiceAba].vencimentoSelecionado;
    novaOferta.opcoes = [...abasMultileg[indiceAba].opcoes];

    if (tipoOferta === "call") {
      novaOferta.tipo = "call";
    } else if (tipoOferta === "put") {
      novaOferta.tipo = "put";
    }
    pesquisarSymbolModel_strike_tipo(novaOferta);
  }
  const novoCodigo = novaOferta.codigoSelecionado;

  if (!verificaCotacaoJaAdd(cotacoesMultileg, novoCodigo)) {
    const dadosAtivo = await pesquisarAtivoAPI(novaOferta.codigoSelecionado);
    if (dadosAtivo) cotacao = Number(dadosAtivo.cotacaoAtual);
  }

  adicionaCotacoesMultileg(cotacoesMultileg, novoCodigo, cotacao);

  //Verifica se o book já foi inserindo, agilizando novas adições de ofertas sem esperar a API
  if (!verificaBookJaAdd(booksMultileg, novoCodigo)) {
    const book = await listarBookOfertaAPI(novaOferta.codigoSelecionado);
    if (book) {
      const bookCompra = book.tabelaOfertasCompra[0];
      const bookVenda =
        book.tabelaOfertasVenda[book.tabelaOfertasVenda.length - 1];

      AdicionaCodigoBooksMultileg(
        booksMultileg,
        novaOferta.codigoSelecionado,
        bookCompra,
        bookVenda
      );
    }
  }

  abasMultileg[indiceAba].tabelaMultileg.push(novaOferta);

  const aba = abasMultileg[indiceAba];
  let calculo = calculoPreco(aba, "ultimo", [], cotacoesMultileg).toFixed(2);
  calculo = formatarNumero(calculo, 2, ".", ",");
  aba.preco = calculo;

  verificarMonitorarAtivoAPI(novaOferta.codigoSelecionado);

  return { abasMultileg, booksMultileg, cotacoesMultileg };
};

////

export const atualizarBookAction = (dispatch, props, booksMultileg) => {
  if (props.eventSource) {
    props.eventSource.close();
  }

  let codigos = "";

  booksMultileg.forEach(book => {
    codigos += book.codigo + ",";
  });

  codigos = codigos.substring(0, codigos.length - 1);

  const newSource = atualizarBookAPI(
    dispatch,
    props,
    codigos,
    "multileg",
    booksMultileg
  );
  dispatch({
    type: ATUALIZAR_SOURCE_EVENT_MULTILEG,
    payload: newSource,
    nomeVariavel: "eventSource"
  });
};

export const oferta = {
  opcoes: [],
  strikeSelecionado: "",
  cv: "compra",
  qtde: 0,
  serie: [],
  serieSelecionada: "",
  codigoSelecionado: "",
  codigoAberto: false,
  tipo: "",
  modelo: "",
  despernamento: 1000,
  prioridade: 0,
  ativoAtual: ""
};

export const aba = {
  nomeAba: "",
  ativo: "",
  ativoAtual: "",
  variacao: 0,
  opcoes: [],
  strikeSelecionado: "",
  codigoAberto: false,
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
  json.formName = "Multileg";

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
export const atualizarCotacaoAction = (dispatch, props, cotacoesMultileg) => {
  if (props.eventSourceCotacao) {
    props.eventSourceCotacao.close();
  }
  let codigos = "";

  cotacoesMultileg.forEach(cotacao => {
    if (!codigos.includes(cotacao.codigo)) codigos += cotacao.codigo + ",";
  });

  codigos = codigos.substring(0, codigos.length - 1);

  const newSource = atualizarCotacaoAPI(
    dispatch,
    props,
    codigos,
    "multileg",
    cotacoesMultileg
  );
  dispatch({
    type: ATUALIZAR_SOURCE_EVENT_MULTILEG,
    payload: newSource,
    nomeVariavel: "eventSourceCotacao"
  });
};

const AdicionaCodigoBooksMultileg = (
  booksMultileg,
  novoCodigo,
  bookCompra = null,
  bookVenda = null
) => {
  const bookJaAdicionado = verificaBookJaAdd(booksMultileg, novoCodigo);

  if (!bookJaAdicionado) {
    booksMultileg.push({
      codigo: novoCodigo,
      compra: bookCompra,
      venda: bookVenda
    });
  }
};

const verificaBookJaAdd = (booksMultileg, novoCodigo) => {
  return booksMultileg.find(book => book.codigo === novoCodigo);
};

export const adicionaCotacoesMultileg = (
  cotacoesMultileg,
  novoCodigo,
  valorCotacao = ""
) => {
  const cotacaoJaAdicionada = verificaCotacaoJaAdd(
    cotacoesMultileg,
    novoCodigo
  );

  if (!cotacaoJaAdicionada) {
    cotacoesMultileg.push({
      codigo: novoCodigo,
      valor: valorCotacao
    });
  }
};

const verificaCotacaoJaAdd = (cotacoesMultileg, novoCodigo) => {
  return cotacoesMultileg.find(cotacao => cotacao.codigo === novoCodigo);
};

export const buscaCotacao = (cotacoesMultileg, codigo) => {
  const cotacao = cotacoesMultileg.find(cotacao => cotacao.codigo === codigo);

  if (cotacao) return cotacao.valor;
  return "0,00";
};

export const buscaBook = (booksMultileg, codigoOferta) => {
  return booksMultileg.find(book => book.codigo === codigoOferta);
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
