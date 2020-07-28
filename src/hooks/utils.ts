import { NamespacesType } from "constants/ActionTypes";

type reducerName =
  | ""
  | "thl"
  | "principal"
  | "multileg"
  | "posicao"
  | "ordensExec";

export const getReducerStateStorePrincipal = (
  state: any,
  reducer: reducerName
) => {
  switch (reducer) {
    case "thl":
      return state.THLReducer;
    case "principal":
      return state.telaPrincipalReducer;
    case "multileg":
      return state.multilegReducer;
    case "posicao":
      return state.posicaoReducer;
    case "ordensExec":
      return state.ordensExecReducer;
    default:
      return state;
  }
};

export const getReducerStateBoletas = (
  state: any,
  namespace: "" | NamespacesType
) => {
  if (namespace) return state[namespace];
  return state;
};

export const getMainReducerState = (state: any) => {
  return state.MainAppReducer;
};
