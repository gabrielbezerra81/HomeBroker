import { createDispatchHook } from "react-redux";
import { GlobalContext } from "redux/StoreCreation";

const dispatchGlobal = createDispatchHook(GlobalContext);

const useDispatchGlobalStore = () => {
  return dispatchGlobal();
};

export default useDispatchGlobalStore;
