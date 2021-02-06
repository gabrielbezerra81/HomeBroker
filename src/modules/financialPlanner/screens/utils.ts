import { InitialPlannerData } from "modules/financialPlanner/types/FinancialPlannerState";
import { Projection } from "./initialPlanner/InitialPlanner";

type Period = "year" | "month" | "week";

export function convertInterestRate(tax: number, from: Period, to: Period) {
  let exp = 1;

  if (from === "year" && to === "month") {
    exp = 1 / 12;
  } //
  else if (from === "month" && to === "week") {
    exp = 7 / 30;
  }

  const rate = (1 + tax) ** exp - 1;

  return rate;
}

type ConvertMode = {
  convertMode: "visualize" | "calculate";
};

export function convertContribution({
  contribution,
  contributionPeriodicity,
  ratePeriodicity,
  convertMode,
}: Pick<
  InitialPlannerData,
  "contribution" | "contributionPeriodicity" | "ratePeriodicity"
> &
  ConvertMode) {
  // a taxa utilizada no cálculo é transformada para mês
  if (ratePeriodicity === "por ano") {
    if (contributionPeriodicity === "por mês") {
      if (convertMode === "visualize") {
        return contribution * 12;
      }

      return contribution;
    } //
    else if (contributionPeriodicity === "por semana") {
      return contribution * 4.3571;
    } //
    else if (contributionPeriodicity === "por ano") {
      return contribution / 12;
    } //
  }

  if (ratePeriodicity === "por mês") {
    if (contributionPeriodicity === "por ano") {
      return contribution / 12;
    } //
    else if (contributionPeriodicity === "por semana") {
      return contribution * 4.3571;
    }
  }

  if (ratePeriodicity === "por semana") {
    if (contributionPeriodicity === "por ano") {
      return contribution / 52.1429;
    } //
    if (contributionPeriodicity === "por mês") {
      return contribution / 4.3571;
    } //
  }

  if (contributionPeriodicity === ratePeriodicity) {
    return contribution;
  }

  return contribution;
}

type Listing = "semanal" | "mensal" | "anual";

export function filterWeeklyProjections(
  projections: Projection[],
  listing: Listing,
) {
  return projections.filter((projection, index) => {
    const compareFunction = listing === "anual" ? "getFullYear" : "getMonth";

    const nextProjection = projections[index + 1];

    if (compareFunction === "getFullYear") {
      const hasFullYear = (index + 1) % 52 === 0;
      if (!hasFullYear) {
        if (index + 1 === projections.length) {
          return true;
        }

        return false;
      }
    }

    if (nextProjection) {
      if (
        projection.period[compareFunction]() ===
        nextProjection.period[compareFunction]()
      ) {
        return false;
      }
    }

    return true;
  });
}

export function convertPeriodByRatePeriodicity({
  periodValue,
  periodicity,
  ratePeriodicity,
}: Pick<
  InitialPlannerData,
  "periodValue" | "periodicity" | "ratePeriodicity"
>) {
  // se tiver calculando com taxa anual ou mensal, precisa obter o período em meses.
  if (["por ano", "por mês"].includes(ratePeriodicity)) {
    if (periodicity === "anos") {
      return periodValue * 12;
    } //
    else if (periodicity === "semanas") {
      const months = +((periodValue / 52.1429) * 12).toFixed(0);

      return months;
    }

    return periodValue;
  }

  // Se tiver calculando com taxa semanal, precisa obter as semanas a partir dos meses ou anos
  if (ratePeriodicity === "por semana") {
    if (periodicity === "anos") {
      const weeks = +(periodValue * 52.1429).toFixed(0);

      return weeks;
    } //
    else if (periodicity === "meses") {
      const weeks = +((periodValue / 12) * 52.1429).toFixed(0);

      return weeks;
    }

    return periodValue;
  }

  // if (periodicity === "anos") {
  //     periods *= 12;
  //   }

  return periodValue;
}
