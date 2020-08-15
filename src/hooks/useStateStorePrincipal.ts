import { StorePrincipalContext } from "redux/StoreCreation";
import { createSelectorHook, TypedUseSelectorHook } from "react-redux";
import { MainStoreState } from "redux/reducers";

const useSelectorStorePrincipal: TypedUseSelectorHook<MainStoreState> = createSelectorHook(
  StorePrincipalContext
);

const useStateStorePrincipal = (): MainStoreState => {
  const reducerState = useSelectorStorePrincipal((state) => {
    return state;
  });
  return reducerState;
};

export default useStateStorePrincipal;
