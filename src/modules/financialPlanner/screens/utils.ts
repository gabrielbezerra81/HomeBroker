import useStateStorePrincipal from "hooks/useStateStorePrincipal";
import {
  InitialPlannerData,
  SimulationResult,
} from "modules/financialPlanner/types/FinancialPlannerState";
import moment from "moment";
import { formatarNumDecimal } from "shared/utils/Formatacoes";
import { Projection } from "./initialPlanner/InitialPlanner";

type Period = "year" | "month" | "week";

export function convertInterestRate(tax: number, from: Period, to: Period) {
  let exp = 1;

  if (from === "year" && to === "month") {
    exp = 1 / 12;
  } //
  else if (from === "year" && to === "week") {
    exp = 7 / 365;
  } //
  else if (from === "month" && to === "year") {
    exp = 12 / 1;
  } //
  else if (from === "month" && to === "week") {
    exp = 7 / 30;
  } //
  else if (from === "week" && to === "month") {
    exp = 30 / 7;
  } //
  else if (from === "week" && to === "year") {
    exp = 365 / 7;
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
      if (convertMode === "visualize") {
        return contribution * 12 * 4;
      }

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
      if (convertMode === "visualize") {
        return contribution * 4;
      }

      return contribution * 4.3571;
    }
  }

  if (ratePeriodicity === "por semana") {
    if (contributionPeriodicity === "por ano") {
      return contribution / 52.1429;
    } //
    if (contributionPeriodicity === "por mês") {
      if (convertMode === "visualize") {
        return contribution / 4;
      }
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

      if (hasFullYear) {
        return true;
      } //
      else if (index + 1 === projections.length) {
        return true;
      }

      return false;
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
      const months = Math.floor((periodValue / 52.1429) * 12);

      return months;
    }

    return periodValue;
  }

  // Se tiver calculando com taxa semanal, precisa obter as semanas a partir dos meses ou anos
  if (ratePeriodicity === "por semana") {
    if (periodicity === "anos") {
      const weeks = Math.floor(periodValue * 52.1429);

      return weeks;
    } //
    else if (periodicity === "meses") {
      const weeks = Math.floor((periodValue / 12) * 52.1429);

      return weeks;
    }

    return periodValue;
  }

  // if (periodicity === "anos") {
  //     periods *= 12;
  //   }

  return periodValue;
}

export function IncludeInitialLine() {
  const {
    financialPlannerReducer: {
      initialPlanner: { initialValue, contribution },
    },
  } = useStateStorePrincipal();

  return {
    rentability: 0,
    periodIncome: 0,
    totalIncome: 0,
    result: 0,
    total: 1000,
    calcBase: 1000,
    investment: 1000,
    totalPercent: 0,
    period: new Date(),
    contribution: 100,
    formattedContribution: contribution.toString(),
    viewedContribution: formatarNumDecimal(initialValue, 2, 2),
    formattedCalcBase: "",
    formattedInvestment: "",
    formattedPeriod: new Date().toLocaleDateString(),
    formattedPeriodIncome: "",
    formattedRentability: "",
    formattedResult: "",
    formattedTotal: "",
    formattedTotalIncome: "",
    formattedTotalPercent: "",
    month: 0,
    order: 0,
    viewedPeriodIncome: "",
    viewedRate: "",
  };
}

type LocalFrequency = "por semana" | "por mês" | "por ano";

type APIFrequency = "semanal" | "mensal" | "anual";

export function convertFrequencyToAPIValues(
  frequency: LocalFrequency,
): APIFrequency {
  switch (frequency) {
    case "por semana":
      return "semanal";
    case "por mês":
      return "mensal";
    case "por ano":
      return "anual";
    default:
      return "semanal";
  }
}

export function convertFrequencyToLocalValues(
  frequency: APIFrequency,
): LocalFrequency {
  switch (frequency) {
    case "semanal":
      return "por semana";
    case "mensal":
      return "por mês";
    case "anual":
      return "por ano";
    default:
      return "por semana";
  }
}

type APIContributionPeriod = "semanas" | "meses" | "anos";

// export function convertPeriodToLocalValues(
//   contributionPeriod: APIContributionPeriod,
// ) {
//   switch (contributionPeriod) {
//     case "semanas":
//       return "por ";
//     case "meses":
//       return "por mês";
//     case "anos":
//       return "por ano";
//     default:
//       return "por semana";
//   }
// }

type CalculateProps = Omit<InitialPlannerData, "listing"> & {
  numberOfPeriods: number;
};

export const calculateSimulationResult = ({
  contribution,
  contributionPeriodicity,
  ratePeriodicity,
  initialValue,
  interestRate,
  numberOfPeriods,
}: CalculateProps): SimulationResult => {
  const monthlyValue = convertContribution({
    contribution,
    contributionPeriodicity,
    ratePeriodicity,
    convertMode: "calculate",
  });

  let excludedPeriodsFromContrib = 1;

  let rate = interestRate / 100;

  // conversão de anual para mensal
  if (ratePeriodicity === "por ano") {
    rate = convertInterestRate(rate, "year", "month");
  }

  if (!rate) {
    return {
      totalInvested: 0,
      total: 0,
      totalIncome: 0,
      formattedTotal: "",
      formattedTotalInvested: "",
      formattedTotalIncome: "",
    };
  }

  if (ratePeriodicity === "por semana") {
    excludedPeriodsFromContrib = 1;
  }

  const gained = initialValue * (1 + rate) ** numberOfPeriods;

  const addedValue =
    (monthlyValue *
      ((1 + rate) ** (numberOfPeriods - excludedPeriodsFromContrib) - 1)) /
    rate;

  const total = gained + addedValue;
  const totalInvested =
    initialValue +
    monthlyValue * (numberOfPeriods - excludedPeriodsFromContrib);
  const totalIncome = total - totalInvested;

  const res = {
    totalInvested,
    total,
    totalIncome,
    formattedTotal: `R$ ${formatarNumDecimal(gained + addedValue, 2)}`,
    formattedTotalInvested: `R$ ${formatarNumDecimal(totalInvested)}`,
    formattedTotalIncome: `R$ ${formatarNumDecimal(totalIncome, 2)}`,
  };

  return res;
};

interface ShouldDisplayTaxMetricProps {
  frequency: LocalFrequency;
  listing: Listing;
}

export const isGroupingListing = ({
  listing,
  frequency,
}: ShouldDisplayTaxMetricProps) => {
  if (
    (frequency === "por semana" && listing === "semanal") ||
    (frequency === "por mês" && listing === "mensal") ||
    (frequency === "por ano" && listing === "anual")
  ) {
    return false;
  }

  return true;
};

export const getTaxMetricSuffix = (listing: Listing) => {
  if (listing === "anual") {
    return " a.a";
  }

  if (listing === "mensal") {
    return " a.m";
  }

  return " p.s";
};

interface CalculateProjectionsParams
  extends Pick<
    InitialPlannerData,
    | "initialValue"
    | "interestRate"
    | "periodValue"
    | "contribution"
    | "contributionPeriodicity"
    | "ratePeriodicity"
    | "periodicity"
  > {
  startDate: Date;
  // weeks, months or years
  numberOfPeriods: number;
}

export const calculateProjections = ({
  initialValue,
  interestRate,
  periodValue,
  contribution,
  contributionPeriodicity,
  ratePeriodicity,
  periodicity,
  numberOfPeriods,
  startDate,
}: CalculateProjectionsParams) => {
  const projections: Projection[] = [];

  if (!initialValue || !interestRate || !periodValue) {
    return [];
  }

  const convertedContributedValue = convertContribution({
    contribution,
    contributionPeriodicity,
    ratePeriodicity,
    convertMode: "calculate",
  });

  let investment = initialValue;

  let monthRate = interestRate / 100;

  // year calculation is converted to months
  if (ratePeriodicity === "por ano") {
    monthRate = convertInterestRate(monthRate, "year", "month");
  }

  // first month has no contribution
  let excludedPeriodsFromContrib = 1;

  if (ratePeriodicity === "por semana") {
    excludedPeriodsFromContrib = 1;
  }

  let total = initialValue;

  let date = moment(startDate).startOf("month").startOf("day").toDate();

  if (ratePeriodicity !== "por semana") {
    // using last day of month for monthly and yearly calculation
    date = moment(date).endOf("month").toDate();
  }

  // indexes represents each period and starts from 1
  for (let index = 1; index <= numberOfPeriods; index++) {
    let calcBase = total;

    const periodIncome = total * monthRate ** 1;

    // const monthPercent = (monthIncome / calcBase) * 100;

    total += periodIncome;

    // the first period (week, month, year) has not contribution
    if (index > excludedPeriodsFromContrib) {
      calcBase += convertedContributedValue;
      total += convertedContributedValue;
      investment += convertedContributedValue;
    }

    const totalIncome = +Number(total - investment).toFixed(2);

    const totalPercent = (totalIncome / investment) * 100;

    let period = new Date(date);

    if (ratePeriodicity === "por semana") {
      // period is the current week with today + 6 days
      period.setDate(period.getDate() + 6);

      // increases 7 so the next period starts in the next day after the
      // week ends.
      date.setDate(date.getDate() + 7);
    }

    // increases 1 month in each iteration
    if (["por mês", "por ano"].includes(ratePeriodicity)) {
      date.setMonth(date.getMonth() + 1);
    }

    const projection = {
      rentability: interestRate,
      periodIncome,
      totalIncome: totalIncome,
      result: 0,
      total: investment + totalIncome,
      calcBase,
      investment,
      totalPercent,
      period,
      contribution: convertedContributedValue,
    };

    projections.push(projection);
  }

  return projections;
};
