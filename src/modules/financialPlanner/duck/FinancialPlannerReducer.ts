import { UPDATE_MANY_FINANCIAL_PLANNER } from "constants/MenuActionTypes";
import Action from "types/Action";
import FinancialPlannerState from "modules/financialPlanner/types/FinancialPlannerState";

const INITIAL_STATE: FinancialPlannerState = {
  initialPlanner: {
    initialValue: 1000,
    contribution: 100,
    contributionPeriodicity: "por semana",
    interestRate: 0.23,
    ratePeriodicity: "por semana",
    periodValue: 2,
    periodicity: "meses",
    listing: "mensal",
  },
  detailedPlanner: {
    simulations: [],
    selectedSimulation:"todos"
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
