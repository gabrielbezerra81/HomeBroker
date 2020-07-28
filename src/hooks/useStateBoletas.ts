import { useSelector } from "react-redux";
import { getReducerStateBoletas } from "./utils";
import { NamespacesType } from "constants/ActionTypes";

const useStateBoletas = (namespace: "" | NamespacesType) => {
  const state = useSelector((state) => state);

  return getReducerStateBoletas(state, namespace);
};

export default useStateBoletas;
