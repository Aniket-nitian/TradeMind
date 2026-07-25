import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 2,
})

export function formatCurrency(value: number | null | undefined) {
  if (value === null || value === undefined) return "—"
  return currencyFormatter.format(value)
}

export function formatDate(value: string | null | undefined) {
  if (!value) return "—"
  return new Date(value).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
}

export function formatDateTime(value: string | null | undefined) {
  if (!value) return "—"
  return new Date(value).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export function pnlClass(value: number | null | undefined) {
  if (value === null || value === undefined) return "text-muted-foreground"
  if (value > 0) return "text-[var(--chart-delta-good)]"
  if (value < 0) return "text-[var(--chart-delta-critical)]"
  return "text-muted-foreground"
}
