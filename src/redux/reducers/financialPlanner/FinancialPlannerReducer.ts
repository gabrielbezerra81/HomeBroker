import { UPDATE_MANY_FINANCIAL_PLANNER } from "constants/MenuActionTypes";
import Action from "types/Action";
import FinancialPlannerState from "types/financialPlanner/FinancialPlannerState";

const INITIAL_STATE: FinancialPlannerState = {
  initialPlanner: {
    initialValue: 1000,
    contribution: 100,
    contributionPeriodicity: "por mês",
    interestRate: 0.23,
    ratePeriodicity: "por semana",
    periodValue: 10,
    periodicity: "meses",
    listing: "mensal",
  },
};

export default (
  state = INITIAL_STATE,
  { type, payload }: Action,
): FinancialPlannerState => {
  switch (type) {
    case UPDATE_MANY_FINANCIAL_PLANNER:
      return { ...state, ...payload };
    default:
      return state;
  }
};
