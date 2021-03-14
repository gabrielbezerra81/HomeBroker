import produce from "immer";
import { DetailedPlannerData } from "modules/financialPlanner/types/FinancialPlannerState";
import { MainThunkAction } from "types/ThunkActions";
import { updateFinancialPlannerAction } from "./utils";

export const updateInitialPlannerStateAction = (
    payload: Partial<DetailedPlannerData>,
  ): MainThunkAction => {
    return (dispatch, getState) => {
      const {
        financialPlannerReducer: { detailedPlanner, ...rest },
      } = getState();
  
      const updatedData = produce(detailedPlanner, (draft) => {
        Object.assign(draft, payload);
      });
  
      dispatch(
        updateFinancialPlannerAction({
          ...rest,
          detailedPlanner: updatedData,
        }),
      );
    };
  };