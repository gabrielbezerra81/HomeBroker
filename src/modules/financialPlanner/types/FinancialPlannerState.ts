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
