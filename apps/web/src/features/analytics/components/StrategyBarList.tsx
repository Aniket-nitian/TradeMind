import { formatCurrency, pnlClass } from "@/lib/utils";
import type { StrategyPerformance } from "../types";

export function StrategyBarList({ data }: { data: StrategyPerformance[] }) {
  if (data.length === 0) {
    return <p className="text-sm text-muted-foreground">No strategy-tagged trades yet.</p>;
  }

  const maxAbs = Math.max(...data.map((s) => Math.abs(s.netPnL)), 1);

  return (
    <div className="flex flex-col gap-4">
      {data.map((s) => {
        const isPositive = s.netPnL >= 0;
        const widthPct = (Math.abs(s.netPnL) / maxAbs) * 100;
        return (
          <div key={s.strategyId}>
            <div className="mb-1 flex items-center justify-between text-sm">
              <span className="font-medium">{s.strategy}</span>
              <span className={pnlClass(s.netPnL)}>
                {formatCurrency(s.netPnL)} ({s.winRate}% win)
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
