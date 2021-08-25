import api from "api/apiConfig";
import { url_saveSimulation } from "api/url";
import produce from "immer";
import {
  calculateSimulationResult,
  convertFrequencyToAPIValues,
} from "modules/financialPlanner/screens/utils";
import { InitialPlannerData } from "modules/financialPlanner/types/FinancialPlannerState";
import { toast } from "react-toastify";
import { atualizarDivKeyAction } from "redux/actions/GlobalAppActions";
import { abrirItemBarraLateralAction } from "redux/actions/system/SystemActions";
import { globalStore } from "redux/StoreCreation";
import { MainThunkAction } from "types/ThunkActions";
import { listSimulationsAction } from "./detailedPlannerActions";
import { updateFinancialPlannerAction } from "./utils";


export const updateInitialPlannerStateAction = (
  payload: Partial<InitialPlannerData>,
): MainThunkAction => {
  return (dispatch, getState) => {
    const {
      financialPlannerReducer: { initialPlanner, ...rest },
    } = getState();

    const updatedData = produce(initialPlanner, (draft) => {
      Object.assign(draft, payload);
    });

    dispatch(
      updateFinancialPlannerAction({
        ...rest,
        initialPlanner: updatedData,
      }),
    );
  };
};

export const handleSaveSimulationAction = (
  simulationTitle: string,
): MainThunkAction => {
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
      title: simulationTitle,
      startDate: new Date().toLocaleDateString(),
    };

    try {
      await api.post(url_saveSimulation, payload);

      await dispatch(listSimulationsAction());

      globalStore.dispatch(atualizarDivKeyAction("detailedPlanner") as any);

      dispatch(abrirItemBarraLateralAction("isOpenDetailedPlanner", true));

      toast.success("Simulação salva com sucesso!");
      document.body.click();
    } catch (error) {
      toast.error("Falha ao salvar simulação");
    }
  };
};

interface CalculateRateParams {
  total: number;
  numberOfPeriods: number;
}

export const calculateRateFromTotalAction = ({
  total,
  numberOfPeriods,
}: CalculateRateParams): MainThunkAction => {
  return (dispatch, getState) => {
    const {
      financialPlannerReducer: {
        initialPlanner: {
          contribution,
          contributionPeriodicity,
          initialValue,
          periodValue,
          periodicity,
          ratePeriodicity,
        },
      },
    } = getState();

    const rateStep = 0.001;

    let closestTotal = 0;
    const target = total;
    let index = 0;
    let closestRate: number = rateStep;

    for (let rate = rateStep; rate <= 1; ) {
      const percentualRate = rate * 100;

      const { total } = calculateSimulationResult({
        contribution,
        contributionPeriodicity,
        initialValue,
        interestRate: percentualRate,
        periodValue,
        periodicity,
        ratePeriodicity,
        numberOfPeriods,
      });

      if (Math.abs(total - target) < Math.abs(closestTotal - target)) {
        closestTotal = total;
        closestRate = +(rateStep + index * rateStep).toFixed(3) * 100;
      } //
      else {
        break;
      }

      rate = +(rate + rateStep).toFixed(3);
      index++;
    }

    dispatch(updateInitialPlannerStateAction({ interestRate: closestRate }));
  };
};
