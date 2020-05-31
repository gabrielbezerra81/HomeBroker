import { MUDAR_VARIAVEL_ORDENS_EXEC } from "constants/MenuActionTypes";
import { LISTAR_ORDENS_EXECUCAO } from "constants/ApiActionTypes";
import {
  ABRIR_FECHAR_ITEM_BARRA_LATERAL,
  LOGAR_DESLOGAR_USUARIO,
} from "constants/ActionTypes";
import { resetarEstadoRedux } from "components/redux/reducers/resetarEstado";

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

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case MUDAR_VARIAVEL_ORDENS_EXEC:
      return { ...state, [action.payload.nome]: action.payload.valor };
    case LISTAR_ORDENS_EXECUCAO:
      return { ...state, tabelaOrdensExecucao: action.payload };
    case ABRIR_FECHAR_ITEM_BARRA_LATERAL:
      return action.payload.name === "ordensExecucaoAberto"
        ? resetarEstadoRedux(
            state,
            INITIAL_STATE,
            ["tabelaOrdensExecucao", "eventSourceOrdensExec"],
            !action.payload.valor,
            "ordensExec",
            false
          )
        : state;
    case LOGAR_DESLOGAR_USUARIO:
      return resetarEstadoRedux(
        state,
        INITIAL_STATE,
        [],
        !action.payload.logado,
        "ordensExec"
      );
    default:
      return state;
  }
};
