import { Projection } from "../screens/initialPlanner/InitialPlanner";

export interface InitialPlannerData {
  initialValue: number;
  contribution: number;
  contributionPeriodicity: "por semana" | "por mês" | "por ano";
  interestRate: number;
  ratePeriodicity: "por semana" | "por mês" | "por ano";
  periodValue: number;
  periodicity: "semanas" | "meses" | "anos";
  listing: "semanal" | "mensal" | "anual";
}

export interface Simulation {
  id: number;
  initialDeposit: number;
  periodicDeposit: number;
  depositFrequency: "semanal" | "mensal" | "anual";
  rate: number;
  rateFrequency: "semanal" | "mensal" | "anual";
  period: number;
  periodType: "semanas" | "meses" | "anos";
  update: string;
  startDate: string;
  title: string;
  tax?: number;
  financialValue?: number;
}

export interface DetailedProjection
  extends Partial<Projection>,
    Omit<Simulation, "period" | "startDate"> {
  startDate: Date;
  periodValue: number;
  totalInvested: number;
  realIncome: number;
  realIncomePercentage: number;
  formattedTotalInvested: string;
  formattedTotal: string;
  formattedTotalIncome: string;
  formattedRealIncome: string;
  formattedTax: number;
  formattedRealIncomePercentage: string;
  [key: string]: any;
}

export interface SimulationResult {
  totalInvested: number;
  total: number;
  totalIncome: number;
  formattedTotal: string;
  formattedTotalInvested: string;
  formattedTotalIncome: string;
}

export interface DetailedPlannerData {
  simulations: Array<Simulation>;
  selectedSimulation: string;
}

export default interface FinancialPlannerState {
  initialPlanner: InitialPlannerData;
  detailedPlanner: DetailedPlannerData;
}
