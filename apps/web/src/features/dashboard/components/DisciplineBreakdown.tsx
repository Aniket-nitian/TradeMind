import { useMemo } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Trade } from "@/features/trades/types";

function BreakdownBar({
  label,
  pct,
  caption,
  color,
}: {
  label: string;
  pct: number | null;
  caption: string;
  color: string;
}) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-sm">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-semibold">{pct === null ? "—" : `${pct}%`}</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full"
          style={{ width: `${pct ?? 0}%`, background: color }}
        />
      </div>
      <p className="mt-1 text-xs text-muted-foreground uppercase">{caption}</p>
    </div>
  );
}

export function DisciplineBreakdown({ trades }: { trades: Trade[] }) {
  const stats = useMemo(() => {
    const withStopLoss = trades.filter((t) => t.stopLoss !== null).length;
    const stopLossPct = trades.length ? Math.round((withStopLoss / trades.length) * 100) : null;

    const planTagged = trades.filter((t) => t.followedPlan !== null);
    const followedPlan = planTagged.filter((t) => t.followedPlan === true).length;
    const planPct = planTagged.length
      ? Math.round((followedPlan / planTagged.length) * 100)
      : null;

    const rrTagged = trades.filter((t) => t.rrRatio !== null);
    const goodRR = rrTagged.filter((t) => (t.rrRatio ?? 0) >= 1).length;
    const rrPct = rrTagged.length ? Math.round((goodRR / rrTagged.length) * 100) : null;

    return { stopLossPct, planPct, rrPct };
  }, [trades]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Discipline breakdown</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <BreakdownBar
          label="Stop-loss discipline"
          pct={stats.stopLossPct}
          caption={
            stats.stopLossPct === null
              ? "No trades yet"
              : "Trades with a stop-loss set"
          }
          color="var(--success)"
        />
        <BreakdownBar
          label="Plan adherence"
          pct={stats.planPct}
          caption={
            stats.planPct === null ? "No journal entries yet" : "Trades that followed the plan"
          }
          color="var(--accent-violet)"
        />
        <BreakdownBar
          label="Risk/reward discipline"
          pct={stats.rrPct}
          caption={
            stats.rrPct === null ? "No R:R data yet" : "Trades taken at R:R ≥ 1"
          }
          color="var(--warning)"
        />
      </CardContent>
    </Card>
  );
}
