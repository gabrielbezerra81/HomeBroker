import { MUDAR_VARIAVEL_ORDENS_EXEC } from "constants/MenuActionTypes";
import { LISTAR_ORDENS_EXECUCAO } from "constants/ApiActionTypes";

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
  eventSourceOrdensExec: null
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case MUDAR_VARIAVEL_ORDENS_EXEC:
      return { ...state, [action.payload.nome]: action.payload.valor };
    case LISTAR_ORDENS_EXECUCAO:
      return { ...state, tabelaOrdensExecucao: action.payload };
    default:
      return state;
  }
};
