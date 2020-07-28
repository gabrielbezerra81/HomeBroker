import { getMainReducerState } from "./utils";
import { GlobalContext } from "redux/StoreCreation";
import { createSelectorHook } from "react-redux";

const useSelectorGlobalStore = createSelectorHook(GlobalContext);

const useStateGlobalStore = () => {
  const state = useSelectorGlobalStore((state) => state);

  return getMainReducerState(state);
};

export default useStateGlobalStore;
