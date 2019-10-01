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
      const dados = await pesquisarStrikesMultilegAction(multileg, indice);
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
  return dispatch => {
    let abasMultileg = [...multileg];

    if (atributo === "tipo") {
      if (valor === "call")
        abasMultileg[indiceGeral].tabelaMultileg[indiceLinha][atributo] = "put";
      else if (valor === "put")
        abasMultileg[indiceGeral].tabelaMultileg[indiceLinha][atributo] =
          "call";
    } else {
      abasMultileg[indiceGeral].tabelaMultileg[indiceLinha][atributo] = valor;
    }

    dispatch({ type: MODIFICAR_ATRIBUTO_ABA, payload: abasMultileg });
  };
};

export const modificarVariavelAction = (nome, valor) => {
  console.log(nome);
  console.log(valor);
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

    if (tipoOferta === "acao") {
      novaOferta.opcoes = [{ symbol: "PETR4" }];
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
      novaOferta.opcoes.forEach(item => {
        if (
          item.strike === novaOferta.strikeSelecionado &&
          item.type === tipoOferta.toUpperCase()
        ) {
          novaOferta.modelo = item.model;
          novaOferta.codigoSelecionado = item.symbol;
          return;
        }
      });
    }
    abasMultileg[indiceAba].tabelaMultileg.push(novaOferta);

    console.log(novaOferta);
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
  codigoSelecionado: "", //remover
  tipo: "",
  modelo: "",
  despernamento: 1000,
  prioridade: 0,
  cotacao: 0,
  compra: { qtde: 3700, preco: 2.4 },
  venda: { qtde: 700, preco: 2.5 }
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
