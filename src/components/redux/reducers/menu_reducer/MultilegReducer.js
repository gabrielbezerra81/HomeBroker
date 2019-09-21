import {} from "constants/ActionTypes";
import {
  MUDAR_TIPO,
  ABRIR_FECHAR_CONFIG_COMPLEMENTAR,
  ADICIONAR_ABA,
  SELECIONAR_ABA,
  MODIFICAR_ATRIBUTO_ABA,
  MODIFICAR_VARIAVEL_MULTILEG
} from "constants/MenuActionTypes";

const INITIAL_STATE = {
  configComplementarAberto: false,
  abaSelecionada: "tab0",
  horaInicial: "",
  horaFinal: "",
  modoExec: "preço",
  apregoarOferta: false,
  multileg: [
    {
      ativo: "PETR4",
      valor: -27.44,
      variacao: 5.33,
      strike: [26.32, 27.48, 28.48],
      strikeSelecionado: "",
      vencimento: ["9/10/19", "10/10/19", "11/10/19"],
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
    }
  ]
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case MUDAR_TIPO:
      return { ...state, tipo: action.payload };
    case ABRIR_FECHAR_CONFIG_COMPLEMENTAR:
      return { ...state, configComplementarAberto: action.payload };
    case ADICIONAR_ABA:
      return {
        ...state,
        multileg: action.payload.multileg,
        abaSelecionada: action.payload.abaSelecionada
      };
    case SELECIONAR_ABA: {
      return { ...state, abaSelecionada: action.payload };
    }
    case MODIFICAR_ATRIBUTO_ABA:
      return { ...state, multileg: action.payload };
    case MODIFICAR_VARIAVEL_MULTILEG:
      return { ...state, [action.payload.nome]: action.payload.valor };
    default:
      return state;
  }
};
