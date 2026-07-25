import { useNavigate } from "react-router-dom";
import { AlertTriangle, CalendarDays, Plus, Target, TrendingDown, TrendingUp } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ErrorState } from "@/components/common/ErrorState";
import { CardGridSkeleton, ChartSkeleton } from "@/components/common/LoadingSkeletons";
import { cn, formatCurrency, pnlClass } from "@/lib/utils";
import { useDemoGate } from "@/features/demo/DemoModeContext";
import { useDashboardOverview, useEquityCurve } from "../hooks";
import { useDrawdown } from "@/features/analytics/hooks";
import { useTrades } from "@/features/trades/hooks";
import { EquityCurveChart } from "../components/EquityCurveChart";
import { DisciplineGauge } from "../components/DisciplineGauge";
import { PerformanceInsights } from "../components/PerformanceInsights";
import { DisciplineBreakdown } from "../components/DisciplineBreakdown";
import { DailyActivity } from "../components/DailyActivity";
import { DashboardOnboarding } from "../components/DashboardOnboarding";
import { NewsCard } from "@/features/news/components/NewsCard";

const today = new Date().toLocaleDateString("en-IN", {
  month: "long",
  day: "numeric",
  year: "numeric",
});

export default function DashboardPage() {
  const navigate = useNavigate();
  const { requireAuth } = useDemoGate();
  const overview = useDashboardOverview();
  const equityCurve = useEquityCurve();
  const drawdown = useDrawdown();
  const trades = useTrades({ page: 1, limit: 50 });

  const isLoading = trades.isLoading || overview.isLoading;
  const hasError = trades.error ?? overview.error;
  const hasAnyTrades = (trades.data?.pagination.total ?? 0) > 0;

  const planAdherence = (() => {
    const tagged = trades.data?.trades.filter((t) => t.followedPlan !== null) ?? [];
    if (tagged.length === 0) return null;
    const followed = tagged.filter((t) => t.followedPlan === true).length;
    return Math.round((followed / tagged.length) * 100);
  })();

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1>Trader Performance</h1>
          <p className="text-muted mt-1">Market activity for {today}. Keep focused.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" disabled>
            <CalendarDays className="size-4" />
            Last 30 days
          </Button>
          <Button onClick={() => requireAuth() && navigate("/trades/new")}>
            <Plus className="size-4" />
            Log trade
          </Button>
        </div>
      </div>

      {isLoading && <CardGridSkeleton />}
      {!isLoading && hasError && <ErrorState error={hasError} />}

      {!isLoading && !hasError && !hasAnyTrades && <DashboardOnboarding />}

      {!isLoading && !hasError && hasAnyTrades && (
        <>
          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="transition-shadow hover:shadow-lg hover:shadow-black/20">
              <CardContent className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <span className="text-eyebrow">Total P&amp;L</span>
                  <div
                    className={cn(
                      "flex size-7 items-center justify-center rounded-lg",
                      (overview.data?.netPnL ?? 0) >= 0
                        ? "bg-success/10 text-success"
                        : "bg-destructive/10 text-destructive"
                    )}
                  >
                    {(overview.data?.netPnL ?? 0) >= 0 ? (
                      <TrendingUp className="size-4" />
                    ) : (
                      <TrendingDown className="size-4" />
                    )}
                  </div>
                </div>
                <span className={`text-2xl font-semibold ${pnlClass(overview.data?.netPnL)}`}>
                  {overview.data ? formatCurrency(overview.data.netPnL) : "—"}
                </span>
                <span className="text-xs text-muted-foreground">
                  {overview.data
                    ? `${overview.data.totalTrades} realized trade${overview.data.totalTrades === 1 ? "" : "s"}`
                    : `${trades.data?.pagination.total ?? 0} trades total`}
                </span>
              </CardContent>
            </Card>

            <Card className="transition-shadow hover:shadow-lg hover:shadow-black/20">
              <CardContent className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <span className="text-eyebrow">Win rate</span>
                  <div className="flex size-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Target className="size-4" />
                  </div>
                </div>
                <span className="text-2xl font-semibold">
                  {overview.data ? `${overview.data.winRate}%` : "—"}
                </span>
                <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{ width: `${overview.data?.winRate ?? 0}%` }}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="transition-shadow hover:shadow-lg hover:shadow-black/20">
              <CardContent className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <span className="text-eyebrow">Max drawdown</span>
                  <div className="flex size-7 items-center justify-center rounded-lg bg-warning/10 text-warning">
                    <AlertTriangle className="size-4" />
                  </div>
                </div>
                <span className="text-2xl font-semibold">
                  {drawdown.data ? `${Math.abs(drawdown.data.drawdownPercent)}%` : "—"}
                </span>
                <span className="text-xs text-muted-foreground">
                  {drawdown.data ? formatCurrency(drawdown.data.maxDrawdown) : "No realized trades yet"}
                </span>
              </CardContent>
            </Card>

            <Card className="transition-shadow hover:shadow-lg hover:shadow-black/20">
              <CardContent className="flex h-full items-center">
                <DisciplineGauge value={planAdherence} label="Plan adherence" />
              </CardContent>
            </Card>
          </div>

          <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-[2fr_1fr]">
            <Card>
              <CardHeader>
                <CardTitle>Equity curve</CardTitle>
              </CardHeader>
              <CardContent>
                {equityCurve.isLoading && <ChartSkeleton />}
                {equityCurve.data && equityCurve.data.length > 0 && (
                  <EquityCurveChart data={equityCurve.data} />
                )}
                {equityCurve.data && equityCurve.data.length === 0 && (
                  <p className="py-10 text-center text-sm text-muted-foreground">
                    No realized trades yet — the equity curve fills in once a trade has an exit
                    price recorded.
                  </p>
                )}
              </CardContent>
            </Card>

            <PerformanceInsights />
          </div>

          <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
            <DisciplineBreakdown trades={trades.data?.trades ?? []} />
            <DailyActivity trades={trades.data?.trades ?? []} />
          </div>

          <NewsCard />
        </>
      )}
    </div>
  );
}
