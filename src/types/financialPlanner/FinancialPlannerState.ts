export default interface FinancialPlannerState {
  initialPlanner: {
    initialValue: number;
    contribution: number;
    contributionPeriodicity: "por semana" | "por mês" | "por ano";
    interestRate: number;
    ratePeriodicity: "por semana" | "por mês" | "por ano";
    periodValue: number;
    periodicity: "semanas" | "meses" | "anos";
    listing: "semanal" | "mensal" | "anual";
  };
}
