import { NamespacesType } from "constants/ActionTypes";
import { MainStoreState } from "redux/reducers";

type reducerName =
  | ""
  | "thl"
  | "principal"
  | "multileg"
  | "posicao"
  | "ordensExec";

export const getReducerStateStorePrincipal = (
  state: MainStoreState,
  reducer: reducerName,
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
  namespace: "" | NamespacesType,
) => {
  if (namespace) return state[namespace];
  return state;
};

export const getMainReducerState = (state: any) => {
  return state.GlobalReducer;
};
