import { formatCurrency, pnlClass } from "@/lib/utils";
import { BROKER_LABELS } from "@/features/broker/types";
import type { BrokerPerformance } from "../types";

export function BrokerBarList({ data }: { data: BrokerPerformance[] }) {
  if (data.length === 0) {
    return <p className="text-sm text-muted-foreground">No realized trades yet.</p>;
  }

  const maxAbs = Math.max(...data.map((b) => Math.abs(b.netPnL)), 1);

  return (
    <div className="flex flex-col gap-4">
      {data.map((b) => {
        const isPositive = b.netPnL >= 0;
        const widthPct = (Math.abs(b.netPnL) / maxAbs) * 100;
        const label = b.broker ? BROKER_LABELS[b.broker] : "Manual entry";
        return (
          <div key={b.broker ?? "manual"}>
            <div className="mb-1 flex items-center justify-between text-sm">
              <span className="font-medium">{label}</span>
              <span className={pnlClass(b.netPnL)}>
                {formatCurrency(b.netPnL)} ({b.winRate}% win)
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${widthPct}%`,
                  background: isPositive
                    ? "var(--chart-delta-good)"
                    : "var(--chart-delta-critical)",
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
