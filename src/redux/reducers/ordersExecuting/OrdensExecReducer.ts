import { MUDAR_VARIAVEL_ORDENS_EXEC } from "constants/MenuActionTypes";
import { LISTAR_ORDENS_EXECUCAO } from "constants/ApiActionTypes";
import { actionType } from "constants/ActionTypes";
import { resetarEstadoRedux } from "redux/reducers/resetarEstadoReducer";
import Action from "types/Action";
import OrdersExecState from "types/ordersExec/OrdersExecState";

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
  eventSourceOrdensExec: null,
  filtrarOrdensAberto: false,
};

export default (
  state = INITIAL_STATE,
  { type, payload }: Action,
): OrdersExecState => {
  switch (type) {
    case MUDAR_VARIAVEL_ORDENS_EXEC:
      return { ...state, [payload.nome]: payload.valor };
    case LISTAR_ORDENS_EXECUCAO:
      return { ...state, tabelaOrdensExecucao: payload };
    case actionType.RESET_REDUX_STATE:
      if (["isOpenOrdersExec", "deslogar"].includes(payload.name))
        return {
          ...resetarEstadoRedux({
            state,
            initialState: INITIAL_STATE,
            omitions: ["tabelaOrdensExecucao", "eventSourceOrdensExec"],
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
    //         ["tabelaOrdensExecucao", "eventSourceOrdensExec"],
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
