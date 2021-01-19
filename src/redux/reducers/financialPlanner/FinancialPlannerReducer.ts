import { UPDATE_MANY_FINANCIAL_PLANNER } from "constants/MenuActionTypes";
import Action from "types/Action";
import FinancialPlannerState from "types/financialPlanner/FinancialPlannerState";

const INITIAL_STATE: FinancialPlannerState = {
  initialValue: 0,
  mensalValue: 0,
  interestRate: 0,
  period: 1,
};

export default (
  state = INITIAL_STATE,
  { type, payload }: Action
): FinancialPlannerState => {
  switch (type) {
    case UPDATE_MANY_FINANCIAL_PLANNER:
      return { ...state, ...payload };
    default:
      return state;
  }
};
