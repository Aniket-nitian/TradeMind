import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/common/PageHeader";
import { EmptyState } from "@/components/common/EmptyState";
import { ChartSkeleton } from "@/components/common/LoadingSkeletons";
import { useDashboardOverview } from "@/features/dashboard/hooks";
import { StatTile } from "@/features/dashboard/components/StatTile";
import {
  useBrokerAnalytics,
  useCalendarHeatmap,
  useConfidenceAnalytics,
  usePsychologyAnalytics,
  useStrategyAnalytics,
  useWinLoss,
} from "../hooks";
import { WinLossDonut } from "../components/WinLossDonut";
import { StrategyBarList } from "../components/StrategyBarList";
import { BrokerBarList } from "../components/BrokerBarList";
import { TimeHeatmapGrid } from "../components/TimeHeatmapGrid";
import { EmotionPnlBars } from "../components/EmotionPnlBars";
import { ConfidenceChart } from "../components/ConfidenceChart";

export default function AnalyticsPage() {
  const { data: overview, isLoading: overviewLoading } = useDashboardOverview();
  const { data: winLoss, isLoading: winLossLoading } = useWinLoss();
  const { data: strategies, isLoading: strategiesLoading } = useStrategyAnalytics();
  const { data: brokers, isLoading: brokersLoading } = useBrokerAnalytics();
  const { data: psychology, isLoading: psychologyLoading } = usePsychologyAnalytics();
  const { data: calendar, isLoading: calendarLoading } = useCalendarHeatmap();
  const { data: confidence, isLoading: confidenceLoading } = useConfidenceAnalytics();

  if (!overviewLoading && overview && overview.totalTrades === 0) {
    return (
      <div>
        <PageHeader title="Analytics" description="Deep dive into your trading performance." />
        <EmptyState
          title="No analytics yet"
          description="Log some trades to see performance breakdowns here."
        />
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Analytics" description="Deep dive into your trading performance." />

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatTile label="Win rate" value={overview ? `${overview.winRate}%` : "—"} />
        <StatTile label="Profit factor" value={overview ? String(overview.profitFactor) : "—"} />
        <StatTile label="Avg R:R" value={overview ? String(overview.averageRR) : "—"} />
        <StatTile label="Total trades" value={overview ? String(overview.totalTrades) : "—"} />
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Win / loss distribution</CardTitle>
          </CardHeader>
          <CardContent>
            {winLossLoading ? <ChartSkeleton /> : winLoss ? <WinLossDonut data={winLoss} /> : null}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Strategy performance</CardTitle>
          </CardHeader>
          <CardContent>
            {strategiesLoading ? (
              <ChartSkeleton />
            ) : strategies ? (
              <StrategyBarList data={strategies} />
            ) : null}
          </CardContent>
        </Card>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Broker performance</CardTitle>
        </CardHeader>
        <CardContent>
          {brokersLoading ? (
            <ChartSkeleton />
          ) : brokers ? (
            <BrokerBarList data={brokers} />
          ) : null}
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Time-based performance</CardTitle>
        </CardHeader>
        <CardContent>
          {calendarLoading ? <ChartSkeleton /> : calendar ? <TimeHeatmapGrid data={calendar} /> : null}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Emotion vs P&amp;L</CardTitle>
          </CardHeader>
          <CardContent>
            {psychologyLoading ? (
              <ChartSkeleton />
            ) : psychology ? (
              <EmotionPnlBars data={psychology} />
            ) : null}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Performance by confidence level</CardTitle>
          </CardHeader>
          <CardContent>
            {confidenceLoading ? (
              <ChartSkeleton />
            ) : confidence ? (
              <ConfidenceChart data={confidence} />
            ) : null}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
