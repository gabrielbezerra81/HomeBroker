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

export const abrirFecharConfigComplAction = configComplementarAberto => {
  return dispatch => {
    dispatch({
      type: ABRIR_FECHAR_CONFIG_COMPLEMENTAR,
      payload: !configComplementarAberto
    });
  };
};

export const selecionarAdicionarAbaAction = (key, multileg) => {
  return dispatch => {
    if (key === "adicionar") {
      let abasMultileg = [...multileg];

      const novaAba = cloneDeep(aba);
      let abaAtual = "tab" + abasMultileg.length;

      abasMultileg.push(novaAba);

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

export const modificarAtributoAbaAction = (
  multileg,
  indice,
  atributo,
  valor
) => {
  return async dispatch => {
    let abasMultileg = [...multileg];

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

    dispatch({ type: MODIFICAR_ATRIBUTO_ABA, payload: abasMultileg });
  };
};

export const modificarAtributoTabelaAbaAction = (
  multileg,
  indiceGeral,
  atributo,
  valor,
  indiceLinha
) => {
  return async dispatch => {
    let abasMultileg = [...multileg];
    let linhaTabela = abasMultileg[indiceGeral].tabelaMultileg[indiceLinha];

    if (atributo === "tipo") {
      console.log("antes", linhaTabela[atributo]);
      if (valor === "call") linhaTabela[atributo] = "put";
      else if (valor === "put") linhaTabela[atributo] = "call";
      pesquisarSymbolModel_strike_tipo(linhaTabela);
      console.log("depois", linhaTabela[atributo]);
      dispatch({ type: MODIFICAR_ATRIBUTO_ABA, payload: abasMultileg });
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
        dispatch({ type: MODIFICAR_ATRIBUTO_ABA, payload: abasMultileg });
      } //
      else if (atributo === "codigoSelecionado") {
        pesquisarSerieStrikeModeloTipo_symbol(linhaTabela);
        dispatch({ type: MODIFICAR_ATRIBUTO_ABA, payload: abasMultileg });
      } //
      else dispatch({ type: MODIFICAR_ATRIBUTO_ABA, payload: abasMultileg });
    }
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

export const excluirOfertaTabelaAction = (multileg, indiceAba, indiceLinha) => {
  return dispatch => {
    let abasMultileg = [...multileg];
    abasMultileg[indiceAba].tabelaMultileg.splice(indiceLinha, 1);

    dispatch({ type: MODIFICAR_ATRIBUTO_ABA, payload: abasMultileg });
  };
};

export const adicionarOfertaTabelaAction = (props, tipoOferta) => {
  return dispatch => {
    let abasMultileg = [...props.multileg];
    const indiceAba = props.indice;
    let novaOferta = cloneDeep(oferta);
    novaOferta.cotacao = abasMultileg[indiceAba].valor;
    novaOferta.ativoAtual = abasMultileg[indiceAba].ativoAtual;
    novaOferta.compra = abasMultileg[indiceAba].book.tabelaCompra;
    novaOferta.venda = abasMultileg[indiceAba].book.tabelaVenda;

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
    }
    abasMultileg[indiceAba].tabelaMultileg.push(novaOferta);

    dispatch({ type: MODIFICAR_ATRIBUTO_ABA, payload: abasMultileg });
  };
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
  ativo: "PETR4",
  valor: 0,
  variacao: 0,
  opcoes: [],
  strikeSelecionado: "",
  vencimento: [],
  vencimentoSelecionado: "",
  preco: "",
  total: "",
  validade: "",
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
