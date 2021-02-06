import { UPDATE_MANY_FINANCIAL_PLANNER } from "constants/MenuActionTypes";
import FinancialPlannerState from "modules/financialPlanner/types/FinancialPlannerState";
import { MainThunkAction } from "types/ThunkActions";

export const updateManyFinancialPlannerAction = (
  payload: Partial<FinancialPlannerState>,
): MainThunkAction => {
  return (dispatch) => {
    dispatch({
      type: UPDATE_MANY_FINANCIAL_PLANNER,
      payload,
    });
  };
};
