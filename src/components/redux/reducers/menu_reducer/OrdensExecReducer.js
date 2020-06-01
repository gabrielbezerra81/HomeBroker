import { MUDAR_VARIAVEL_ORDENS_EXEC } from "constants/MenuActionTypes";
import { LISTAR_ORDENS_EXECUCAO } from "constants/ApiActionTypes";
import { actionType } from "constants/ActionTypes";
import { resetarEstadoRedux } from "components/redux/reducers/resetarEstadoReducer";

const INITIAL_STATE = {
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

export default (state = INITIAL_STATE, { type, payload }) => {
  switch (type) {
    case MUDAR_VARIAVEL_ORDENS_EXEC:
      return { ...state, [payload.nome]: payload.valor };
    case LISTAR_ORDENS_EXECUCAO:
      return { ...state, tabelaOrdensExecucao: payload };
    case actionType.RESET_REDUX_STATE:
      if (["ordensExecucaoAberto", "deslogar"].includes(payload.name))
        return {
          ...resetarEstadoRedux(
            state,
            INITIAL_STATE,
            ["tabelaOrdensExecucao", "eventSourceOrdensExec"],
            "ordensExec",
            payload.limparReducer
          ),
        };
      else return state;
    // case ABRIR_FECHAR_ITEM_BARRA_LATERAL:
    //   return action.payload.name === "ordensExecucaoAberto"
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
    //     !action.payload.logado,
    //     "ordensExec"
    //   );
    default:
      return state;
  }
};
