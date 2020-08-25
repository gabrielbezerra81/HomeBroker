import {
  AUMENTAR_ZINDEX,
  CRIAR_APP,
  MOSTRAR_APP,
  ATUALIZAR_SHOW,
  ATUALIZAR_DIVKEY,
  FECHAR_FORM,
} from "constants/ActionTypes";
import { MUDAR_ORDEM_EXEC_MAIN_REDUCER } from "constants/MenuActionTypes";

const INITIAL_STATE = {
  apps: [],
  show: [],
  divkey: "",
  zIndex: 100,
  dadosOrdemExec: null,
  ultimaBoletaAbertaOrdemExec: "",
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case CRIAR_APP:
      return {
        ...state,
        apps: action.apps,
        show: action.show,
        zIndex: action.zIndex,
      };
    case MOSTRAR_APP:
      return {
        ...state,
        apps: action.apps,
        show: action.show,
        zIndex: action.zIndex,
      };
    case ATUALIZAR_SHOW:
      return { ...state, show: action.payload };
    case AUMENTAR_ZINDEX:
      return { ...state, zIndex: action.payload, divkey: "" };
    case ATUALIZAR_DIVKEY:
      return { ...state, divkey: action.payload };
    case FECHAR_FORM:
      return { ...state, show: action.payload, divkey: "" };
    //todo
    case MUDAR_ORDEM_EXEC_MAIN_REDUCER:
      return {
        ...state,
        dadosOrdemExec: action.payload.dadosOrdemExec,
        ultimaBoletaAbertaOrdemExec: action.payload.ultimaBoletaAbertaOrdemExec,
      };
    default:
      return state;
  }
};
