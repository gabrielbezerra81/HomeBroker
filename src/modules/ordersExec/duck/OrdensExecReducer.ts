import {
  MUDAR_VARIAVEL_ORDENS_EXEC,
  MUDA_VARIAVEIS_ORDENS_EXEC,
} from "constants/MenuActionTypes";
import { LISTAR_ORDENS_EXECUCAO } from "constants/ApiActionTypes";
import { actionType } from "constants/ActionTypes";
import { resetarEstadoRedux } from "redux/reducers/resetarEstadoReducer";
import Action from "types/Action";
import OrdersExecState from "modules/ordersExec/types/OrdersExecState";

const INITIAL_STATE: OrdersExecState = {
  ativoFiltrarOrdens: "",
  mercadoFiltrarOrdens: "",
  contaFiltrarOrdens: "",
  statusFiltrarOrdens: "",
  dataFiltrarOrdens: "",
  ofertaFiltrarOrdens: "",
  tabelaOrdensExecucao: [],
  opcoesOrdemAberto: false,
  ordemAtual: null,
  selectQtdeAberto: false,
  selectPrecoAberto: false,
  sinalInputSelect: "+",
  esource_ordersExec: null,
  filtrarOrdensAberto: false,
  interval_ordersExec: null,
};

export default (
  state = INITIAL_STATE,
  { type, payload }: Action,
): OrdersExecState => {
  switch (type) {
    case MUDAR_VARIAVEL_ORDENS_EXEC:
      return { ...state, [payload.nome]: payload.valor };
    case MUDA_VARIAVEIS_ORDENS_EXEC:
      return { ...state, ...payload };
    case LISTAR_ORDENS_EXECUCAO:
      return { ...state, tabelaOrdensExecucao: payload };
    case actionType.RESET_REDUX_STATE:
      if (["isOpenOrdersExec", "deslogar"].includes(payload.name))
        return {
          ...resetarEstadoRedux({
            state,
            initialState: INITIAL_STATE,
            omitions: ["tabelaOrdensExecucao", "esource_ordersExec"],
            reducerName: "ordensExec",
            shouldClearAllProps: payload.limparReducer,
          }),
        };
      else return state;
    // case ABRIR_FECHAR_ITEM_BARRA_LATERAL:
    //   return action.payload.name === "isOpenOrdersExec"
    //     ? resetarEstadoRedux(
    //         state,
    //         INITIAL_STATE,
    //         ["tabelaOrdensExecucao", "esource_ordersExec"],
    //         !action.payload.valor,
    //         "ordensExec",
    //         false
    //       )
    //     : state;
    // case LOGAR_DESLOGAR_USUARIO:
    //   return resetarEstadoRedux(
    //     state,
    //     INITIAL_STATE,
    //     [],
    //     !action.payload.isLogged,
    //     "ordensExec"
    //   );
    default:
      return state;
  }
};
