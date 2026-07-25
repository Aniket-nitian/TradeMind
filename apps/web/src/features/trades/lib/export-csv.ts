import type { Trade } from "../types";

const COLUMNS: (keyof Trade)[] = [
  "symbol",
  "segment",
  "product",
  "side",
  "status",
  "quantity",
  "entryPrice",
  "exitPrice",
  "stopLoss",
  "target",
  "entryTime",
  "exitTime",
  "netPnl",
  "rrRatio",
  "confidence",
];

function escapeCsvValue(value: unknown): string {
  if (value === null || value === undefined) return "";
  const str = String(value);
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export function exportTradesToCsv(trades: Trade[], filename = "trades.csv") {
  const header = COLUMNS.join(",");
  const rows = trades.map((trade) =>
    COLUMNS.map((col) => escapeCsvValue(trade[col])).join(",")
  );
  const csv = [header, ...rows].join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
