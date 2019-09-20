import {} from "constants/ActionTypes";
import {
  MUDAR_TIPO,
  ABRIR_FECHAR_CONFIG_COMPLEMENTAR,
  ADICIONAR_ABA,
  SELECIONAR_ABA,
  MODIFICAR_ATRIBUTO_ABA
} from "constants/MenuActionTypes";

const INITIAL_STATE = {
  configComplementarAberto: false,
  abaSelecionada: "tab0",
  tipo: "put",
  multileg: [
    {
      ativo: "PETR4",
      valor: -27.44,
      variacao: 5.33,
      strike: [26.32, 27.48, 28.48],
      strikeSelecionado: "",
      vencimento: ["9/10/19", "10/10/19", "11/10/19"],
      vencimentoSelecionado: "",
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
          valor: "-41,00"
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
          valor: "-201,00"
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
    default:
      return state;
  }
};
