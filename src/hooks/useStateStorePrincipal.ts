import { getReducerStateStorePrincipal } from "./utils";
import { StorePrincipalContext } from "redux/StoreCreation";
import { createSelectorHook } from "react-redux";

type reducerName =
  | ""
  | "thl"
  | "principal"
  | "multileg"
  | "posicao"
  | "ordensExec";

const useSelectorStorePrincipal = createSelectorHook(StorePrincipalContext);

const useStateStorePrincipal = (reducer: reducerName) => {
  const state = useSelectorStorePrincipal((state) => state);

  return getReducerStateStorePrincipal(state, reducer);
};

export default useStateStorePrincipal;
