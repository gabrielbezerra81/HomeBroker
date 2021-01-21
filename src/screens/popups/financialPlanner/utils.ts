export function convertYearTaxToMonthly(tax: number) {
  const rate = (1 + tax) ** (1 / 12) - 1;

  return rate;
}
