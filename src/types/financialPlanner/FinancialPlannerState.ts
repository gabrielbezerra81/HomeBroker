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

export default interface FinancialPlannerState {
  initialPlanner: InitialPlannerData;
}
