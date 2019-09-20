import {
  MUDAR_TIPO,
  ABRIR_FECHAR_CONFIG_COMPLEMENTAR,
  ADICIONAR_ABA,
  SELECIONAR_ABA,
  MODIFICAR_ATRIBUTO_ABA
} from "constants/MenuActionTypes";

export const mudarTipoAction = tipo => {
  return dispatch => {
    let novo_tipo = "";

    if (tipo === "call") novo_tipo = "put";
    else if (tipo === "put") novo_tipo = "call";

    dispatch({
      type: MUDAR_TIPO,
      payload: novo_tipo
    });
  };
};

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

      const novaAba = aba;
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

export const modificarAtributoAction = (multileg, indice, atributo, valor) => {
  return dispatch => {
    let abasMultileg = [...multileg];
    abasMultileg[indice][atributo] = valor;

    dispatch({ type: MODIFICAR_ATRIBUTO_ABA, payload: abasMultileg });
  };
};

const aba = {
  ativo: "PETR3",
  valor: -27.44,
  variacao: 5.33,
  strike: [26.32, 27.48, 28.48],
  vencimento: ["9/10/19", "10/10/19", "11/10/19"],
  tabelaMultileg: [
    {
      vencimento: ["9/10/19", "10/10/19", "11/10/19"],
      strike: [26.32, 27.48, 28.48],
      cv: "compra",
      qtde: 1000,
      serie: ["2019-08", "2019-07", "2019-06"],
      codigo: ["PETRH275", "PETRH275", "PETRH275"],
      tipo: "call",
      modelo: "EU",
      despernamento: 1000,
      prioridade: 0,
      cotacao: "15,26",
      valor: "-41,00"
    },
    {
      strike: [26.32, 27.48, 28.48],
      vencimento: ["9/10/19", "10/10/19", "11/10/19"],
      cv: "venda",
      qtde: 2000,
      serie: ["2019-08", "2019-07", "2019-06"],
      codigo: ["PETRH275", "PETRH275", "PETRH275"],
      tipo: "put",
      modelo: "USA",
      despernamento: 1000,
      prioridade: 0,
      cotacao: "10,35",
      valor: "-201,00"
    }
  ]
};
