import api from "api/apiConfig";
import { url_listSimulations } from "api/url";
import produce from "immer";
import { DetailedPlannerData } from "modules/financialPlanner/types/FinancialPlannerState";
import { MainThunkAction } from "types/ThunkActions";
import { updateFinancialPlannerAction } from "./utils";

export const updateDetailedPlannerStateAction = (
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


export const listSimulationsAction = (): MainThunkAction => {
  return async (dispatch) => {
    try {
      const response = await api.get(url_listSimulations);

      if (response.data && Array.isArray(response.data)) {
        const { data } = response;

        dispatch(updateDetailedPlannerStateAction({ simulations: data }));
      }
    } catch (error) {}
  };
};
