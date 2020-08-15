import { useSelector, TypedUseSelectorHook } from "react-redux";
import { BoletasState } from "redux/reducers";

const useTypedSelector: TypedUseSelectorHook<BoletasState> = useSelector;

const useStateBoletas = (): BoletasState => {
  const state = useTypedSelector((state) => state);

  return state;
};

export default useStateBoletas;
