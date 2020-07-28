import { getReducerStateStorePrincipal } from "./utils";
import { useSelectorStorePrincipal } from "redux/StoreCreation";

type reducerName =
  | ""
  | "thl"
  | "principal"
  | "multileg"
  | "posicao"
  | "ordensExec";

const useStateStorePrincipal = (reducer: reducerName) => {
  const state = useSelectorStorePrincipal((state) => state);

  return getReducerStateStorePrincipal(state, reducer);
};

export default useStateStorePrincipal;
