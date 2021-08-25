import api from "api/apiConfig";
import { url_listSimulations } from "api/url";
import produce from "immer";
import {
  DetailedPlannerData,
  Simulation,
} from "modules/financialPlanner/types/FinancialPlannerState";

import { toast } from "react-toastify";

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

interface ChangeSimulation {
  attr: keyof Simulation;
  value: any;
  simIndex: number;
}

export const changeSimulationAction = ({
  attr,
  value,
  simIndex,
}: ChangeSimulation): MainThunkAction => {
  return (dispatch, getState) => {
    const {
      financialPlannerReducer: {
        detailedPlanner: { simulations },
      },
    } = getState();

    const updatedSimulations = produce(simulations, (draft) => {
      let newValue: any = value;

      const simulation = draft[simIndex];

      switch (attr) {
        case "period":
          newValue = Number(value);
      }

      if (attr === "rateFrequency" || attr === "depositFrequency") {
        simulation.rateFrequency = newValue;
        simulation.depositFrequency = newValue;

        // only simulations with weekly rate can have period in weeks
        if (newValue !== "semanal" && simulation.periodType === "semanas") {
          simulation.periodType = "meses";
        }
      } //
      else {
        Object.assign(simulation, { [attr]: newValue });
      }
    });

    dispatch(
      updateDetailedPlannerStateAction({ simulations: updatedSimulations }),
    );
  };
};

export const addNewSimulationAction = (): MainThunkAction => {
  return (dispatch, getState) => {
    const {
      financialPlannerReducer: {
        detailedPlanner: { simulations },
      },
    } = getState();

    const updatedSimulations = produce(simulations, (draft) => {
      draft.push({
        depositFrequency: "mensal",
        id: -1,
        initialDeposit: 0,
        period: "" as any,
        periodType: "meses",
        periodicDeposit: 0,
        rate: 0,
        rateFrequency: "mensal",
        startDate: "",
        title: "",
        update: "",
      });
    });

    dispatch(
      updateDetailedPlannerStateAction({ simulations: updatedSimulations }),
    );
  };
};

export const executeSimulationAction = () => {};

export const removeSimulationAction = (id: number): MainThunkAction => {
  return async (dispatch, getState) => {
    const {
      financialPlannerReducer: {
        detailedPlanner: { simulations },
      },
    } = getState();

    try {
      await api.delete(`projections/${id}`);

      const updatedSimulations = produce(simulations, (draft) => {
        const index = draft.findIndex((simulation) => simulation.id === id);

        if (index !== -1) {
          draft.splice(index, 1);
        }
      });

      dispatch(
        updateDetailedPlannerStateAction({ simulations: updatedSimulations }),
      );
    } catch (error) {
      toast.error("Falha ao tentar remover esta simulação");
    }
  };
};
