import { actionType } from "constants/ActionTypes";
import {
  UPDATE_ONE_CONDITIONAL_MULTILEG,
  UPDATE_MANY_CONDITIONAL_MULTILEG,
} from "constants/MenuActionTypes";
import { resetarEstadoRedux } from "redux/reducers/resetarEstadoReducer";
import ConditionalMultilegReducer from "../types/ConditionalMultilegState";
import Action from "types/Action";

const INITIAL_STATE: ConditionalMultilegReducer = {
  configComplementarAberto: false,
  abaSelecionada: "tab0",
  horaInicial: "",
  horaFinal: "",
  modoExec: "preço",
  apregoarOferta: false,
  multileg: [
    {
      nomeAba: "Ordem 1",
      ativo: "PETR4",
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
  executionStrategies: [],
  loadingOffers: false,
};

export default (
  state = INITIAL_STATE,
  { type, payload }: Action,
): ConditionalMultilegReducer => {
  switch (type) {
    case UPDATE_ONE_CONDITIONAL_MULTILEG:
      return { ...state, [payload.attributeName]: payload.attributeValue };
    case UPDATE_MANY_CONDITIONAL_MULTILEG:
      return { ...state, ...payload };
    case actionType.RESET_REDUX_STATE:
      if (["isOpenConditionalMultileg", "deslogar"].includes(payload.name))
        return {
          ...resetarEstadoRedux({
            state,
            initialState: INITIAL_STATE,
            omitions: ["multileg", "cotacoesMultileg"],
            reducerName: "conditionalMultileg",
            shouldClearAllProps: payload.limparReducer,
          }),
        };
      else return state;
    default:
      return state;
  }
};
