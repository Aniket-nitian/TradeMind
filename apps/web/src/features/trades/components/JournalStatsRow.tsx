import { useMemo } from "react";
import { Award, Scale, Target, TrendingDown, TrendingUp } from "lucide-react";

import { StatTile } from "@/features/dashboard/components/StatTile";
import { cn, formatCurrency, pnlClass } from "@/lib/utils";
import type { Trade } from "../types";

export function JournalStatsRow({ trades }: { trades: Trade[] }) {
  const stats = useMemo(() => {
    const closed = trades.filter((t) => t.netPnl !== null);
    const totalPnl = closed.reduce((sum, t) => sum + (t.netPnl ?? 0), 0);
    const wins = closed.filter((t) => (t.netPnl ?? 0) > 0);
    const winRate = closed.length > 0 ? (wins.length / closed.length) * 100 : null;

    const rrValues = trades
      .map((t) => t.rrRatio)
      .filter((v): v is number => v !== null);
    const avgRR =
      rrValues.length > 0
        ? rrValues.reduce((sum, v) => sum + v, 0) / rrValues.length
        : null;

    const byStrategy = new Map<string, number>();
    for (const t of closed) {
      if (!t.strategy) continue;
      byStrategy.set(
        t.strategy.name,
        (byStrategy.get(t.strategy.name) ?? 0) + (t.netPnl ?? 0)
      );
    }
    const best = [...byStrategy.entries()].sort((a, b) => b[1] - a[1])[0];

    return {
      totalPnl,
      winRate,
      avgRR,
      bestStrategy: best?.[0] ?? "—",
    };
  }, [trades]);

  return (
    <div className="mb-4 grid grid-cols-2 gap-4 lg:grid-cols-4">
      <StatTile
        label="Total P&L (this page)"
        value={formatCurrency(stats.totalPnl)}
        valueClassName={pnlClass(stats.totalPnl)}
        icon={stats.totalPnl >= 0 ? TrendingUp : TrendingDown}
        iconClassName={cn(
          stats.totalPnl >= 0 ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"
        )}
      />
      <StatTile
        label="Win rate"
        value={stats.winRate === null ? "—" : `${stats.winRate.toFixed(1)}%`}
        icon={Target}
      />
      <StatTile
        label="Avg R:R"
        value={stats.avgRR === null ? "—" : stats.avgRR.toFixed(2)}
        icon={Scale}
      />
      <StatTile label="Best strategy" value={stats.bestStrategy} icon={Award} iconClassName="bg-warning/10 text-warning" />
    </div>
  );
}
