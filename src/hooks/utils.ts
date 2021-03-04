import { NamespacesType } from "constants/ActionTypes";
import { MainStoreState } from "redux/StoreCreation";

import { $CombinedState } from "redux";

type reducerName =
  | ""
  | "thl"
  | "principal"
  | "multileg"
  | "posicao"
  | "ordensExec";
type key = keyof Omit<MainStoreState, typeof $CombinedState>;
type State = MainStoreState[key];

export const getReducerStateStorePrincipal = (
  state: MainStoreState,
  reducer: reducerName,
) => {
  switch (reducer) {
    case "thl":
      return state.thlReducer;
    case "principal":
      return state.systemReducer;
    case "multileg":
      return state.multilegReducer;
    case "posicao":
      return state.positionReducer;
    case "ordensExec":
      return state.ordersExecReducer;
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
