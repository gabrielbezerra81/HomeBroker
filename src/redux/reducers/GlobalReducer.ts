import {
  AUMENTAR_ZINDEX,
  CRIAR_APP,
  MOSTRAR_APP,
  ATUALIZAR_SHOW,
  ATUALIZAR_DIVKEY,
  FECHAR_FORM,
} from "constants/ActionTypes";
import { MUDAR_ORDEM_EXEC_MAIN_REDUCER } from "constants/MenuActionTypes";
import GlobalState from "types/global/GlobalState";
import Action from "types/Action";

const INITIAL_STATE: GlobalState = {
  apps: [],
  show: [],
  divkey: "",
  zIndex: 100,
  dadosOrdemExec: null,
  ultimaBoletaAbertaOrdemExec: "",
};

export default (
  state = INITIAL_STATE,
  { type, payload }: Action,
): GlobalState => {
  switch (type) {
    case CRIAR_APP:
      return {
        ...state,
        apps: payload.apps,
        show: payload.show,
        zIndex: payload.zIndex,
      };
    case MOSTRAR_APP:
      return {
        ...state,
        apps: payload.apps,
        show: payload.show,
        zIndex: payload.zIndex,
      };
    case ATUALIZAR_SHOW:
      return { ...state, show: payload };
    case AUMENTAR_ZINDEX:
      return { ...state, zIndex: payload, divkey: "" };
    case ATUALIZAR_DIVKEY:
      return { ...state, divkey: payload };
    case FECHAR_FORM:
      return { ...state, show: payload, divkey: "" };
    case MUDAR_ORDEM_EXEC_MAIN_REDUCER:
      return {
        ...state,
        dadosOrdemExec: payload.dadosOrdemExec,
        ultimaBoletaAbertaOrdemExec: payload.ultimaBoletaAbertaOrdemExec,
      };
    default:
      return state;
  }
};
