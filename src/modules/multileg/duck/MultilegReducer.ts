import { actionType } from "constants/ActionTypes";
import {
  MODIFICAR_VARIAVEL_MULTILEG,
  MODIFICAR_VARIAVEIS_MULTILEG,
} from "constants/MenuActionTypes";
import { resetarEstadoRedux } from "redux/reducers/resetarEstadoReducer";
import MultilegState from "../types/MultilegState";
import Action from "types/Action";

const INITIAL_STATE: MultilegState = {
  configComplementarAberto: false,
  abaSelecionada: "tab0",
  horaInicial: "",
  horaFinal: "",
  modoExec: "preço",
  apregoarOferta: false,
  multileg: [
    {
      nomeAba: "Ordem 1",
      ativo: "",
      ativoAtual: "",
      variacao: 0,
      opcoes: [],
      strikeSelecionado: undefined,
      codigoAberto: false,
      vencimento: [],
      vencimentoSelecionado: "",
      preco: "",
      validadeSelect: "DAY",
      date: new Date(),
      tabelaMultileg: [],
      isAlertOpen: false,
      operator: "Less",
      param: "Bid",
      comment: "",
      selectedStrategy: 1,
      market: "",
      editingOrderId: null,
    },
  ],
  esource_multilegQuotes: null,
  interval_multilegQuotes: null,
  cotacoesMultileg: [],
  cotacoesMultilegID: 0,
  alerts: [],
  executionStrategies: [],
  loadingOffers: false,
};

export default (
  state = INITIAL_STATE,
  { type, payload }: Action,
): MultilegState => {
  switch (type) {
    case MODIFICAR_VARIAVEL_MULTILEG:
      return { ...state, [payload.attributeName]: payload.attributeValue };
    case MODIFICAR_VARIAVEIS_MULTILEG:
      return { ...state, ...payload };
    case actionType.RESET_REDUX_STATE:
      if (["isOpenMultileg", "deslogar"].includes(payload.name))
        return {
          ...resetarEstadoRedux({
            state,
            initialState: INITIAL_STATE,
            omitions: ["multileg", "cotacoesMultileg", "alerts"],
            reducerName: "multileg",
            shouldClearAllProps: payload.limparReducer,
          }),
          alerts: state.alerts,
        };
      else return state;
    default:
      return state;
  }
};
