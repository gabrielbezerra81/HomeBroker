import { getMainReducerState } from "./utils";
import { useSelectorGlobalStore } from "redux/StoreCreation";

const useStateGlobalStore = () => {
  const state = useSelectorGlobalStore((state) => state);

  return getMainReducerState(state);
};

export default useStateGlobalStore;
