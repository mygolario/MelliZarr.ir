export type PriceInput = {
  weightGrams: number;
  pricePerGram: number;
  wagePercent: number;
  fixedMarkup: number;
};

/** قیمت نهایی به تومان (عدد صحیح) */
export function calculateUnitPriceToman(input: PriceInput): number {
  const metal = input.weightGrams * input.pricePerGram;
  const withWage = metal * (1 + input.wagePercent / 100);
  return Math.round(withWage + input.fixedMarkup);
}

export function formatToman(amount: number): string {
  return new Intl.NumberFormat("fa-IR").format(amount) + " تومان";
}

export function formatWeightGrams(weight: number): string {
  return new Intl.NumberFormat("fa-IR", {
    maximumFractionDigits: 3,
  }).format(weight) + " گرم";
}

export function formatFaDateTime(date: Date | string | number): string {
  const value = date instanceof Date ? date : new Date(date);
  if (Number.isNaN(value.getTime())) return "—";
  return new Intl.DateTimeFormat("fa-IR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(value);
}
