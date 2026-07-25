export function round(value: number, digits = 2): number {
  return Number(value.toFixed(digits));
}

export function percentage(value: number): string {
  return `${value.toFixed(2)}%`;
}

export function currency(value: number): string {
  return `₹${value.toFixed(2)}`;
}