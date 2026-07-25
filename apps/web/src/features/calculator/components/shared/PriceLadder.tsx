import { cn, formatCurrency } from "@/lib/utils";

export interface PriceLadderRow {
  label: string;
  value: number;
  tone: "resistance" | "pivot" | "support";
}

const toneText: Record<PriceLadderRow["tone"], string> = {
  resistance: "text-destructive",
  pivot: "text-primary",
  support: "text-success",
};

const toneBg: Record<PriceLadderRow["tone"], string> = {
  resistance: "bg-destructive/10",
  pivot: "bg-primary/10",
  support: "bg-success/10",
};

export function PriceLadder({ rows }: { rows: PriceLadderRow[] }) {
  const sorted = [...rows].sort((a, b) => b.value - a.value);

  return (
    <div className="flex flex-col gap-1.5">
      {sorted.map((row) => (
        <div
          key={row.label}
          className={cn(
            "flex items-center justify-between rounded-lg px-3 py-2",
            toneBg[row.tone]
          )}
        >
          <span
            className={cn(
              "text-xs font-semibold tracking-wide uppercase",
              toneText[row.tone]
            )}
          >
            {row.label}
          </span>
          <span
            className={cn(
              "text-sm font-semibold tabular-nums",
              toneText[row.tone]
            )}
          >
            {formatCurrency(row.value)}
          </span>
        </div>
      ))}
    </div>
  );
}
