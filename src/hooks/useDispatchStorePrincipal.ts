import { createDispatchHook } from "react-redux";
import { StorePrincipalContext } from "redux/StoreCreation";

const dispatchPrincipal = createDispatchHook(StorePrincipalContext);

const useDispatchStorePrincipal = () => {
  return dispatchPrincipal();
};

export default useDispatchStorePrincipal;
