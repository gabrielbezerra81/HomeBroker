import api from "api/apiConfig";
import { url_saveSimulation } from "api/url";
import { UPDATE_MANY_FINANCIAL_PLANNER } from "constants/MenuActionTypes";
import { convertFrequencyToAPIValues } from "modules/financialPlanner/screens/utils";
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

export const handleSaveSimulationAction = (): MainThunkAction => {
  return async (dispatch, getState) => {
    const {
      financialPlannerReducer: {
        initialPlanner: {
          initialValue,
          contribution,
          contributionPeriodicity,
          interestRate,
          ratePeriodicity,
          periodicity,
          periodValue,
        },
      },
    } = getState();

    const payload = {
      initialDeposit: initialValue,
      periodicDeposit: contribution,
      depositFrequency: convertFrequencyToAPIValues(contributionPeriodicity),
      rate: interestRate,
      rateFrequency: convertFrequencyToAPIValues(ratePeriodicity),
      period: periodValue,
      periodType: periodicity,
    };

    try {
      await api.post(url_saveSimulation, payload);
    } catch (error) {
      alert("Falha ao salvar simulação");
    }
  };
};
