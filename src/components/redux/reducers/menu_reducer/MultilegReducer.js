import {} from "constants/ActionTypes";
import {
  MUDAR_TIPO,
  ABRIR_FECHAR_CONFIG_COMPLEMENTAR,
  ADICIONAR_ABA,
  SELECIONAR_ABA,
  MODIFICAR_ATRIBUTO_ABA,
  MODIFICAR_VARIAVEL_MULTILEG
} from "constants/MenuActionTypes";
import { PESQUISAR_ATIVO_MULTILEG_API } from "constants/ApiActionTypes";

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
    case PESQUISAR_ATIVO_MULTILEG_API:
      return { ...state, multileg: action.payload };
    default:
      return state;
  }
};
