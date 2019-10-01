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
import { pesquisarStrikesMultilegAPI } from "components/api/API";

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

const aba = {
  ativo: "",
  valor: 0,
  variacao: 0,
  opcoes: [],
  strikeSelecionado: "",
  vencimento: [],
  vencimentoSelecionado: "",
  preco: "",
  total: "",
  validade: "",
  tabelaMultileg: [
    {
      vencimento: ["9/10/19", "10/10/19", "11/10/19"],
      strike: [26.32, 27.48, 28.48],
      strikeSelecionado: "",
      cv: "compra",
      qtde: 1000,
      serie: ["2019-08", "2019-07", "2019-06"],
      serieSelecionada: "",
      codigo: ["PETRH275", "PETRH275", "PETRH275"],
      tipo: "call",
      modelo: "EU",
      despernamento: 1000,
      prioridade: 0,
      cotacao: "15,26",
      valor: "-41,00",
      compra: { qtde: 3700, preco: 2.4 },
      venda: { qtde: 700, preco: 2.5 }
    },
    {
      strike: [26.32, 27.48, 28.48],
      strikeSelecionado: "",
      vencimento: ["9/10/19", "10/10/19", "11/10/19"],
      cv: "venda",
      qtde: 2000,
      serie: ["2019-08", "2019-07", "2019-06"],
      serieSelecionada: "",
      codigo: ["PETRH275", "PETRH275", "PETRH275"],
      codigoSelecionado: "",
      tipo: "put",
      modelo: "USA",
      despernamento: 1000,
      prioridade: 0,
      cotacao: "10,35",
      valor: "-201,00",
      compra: { qtde: 3700, preco: 1.5 },
      venda: { qtde: 1700, preco: 1.6 }
    }
  ]
};
