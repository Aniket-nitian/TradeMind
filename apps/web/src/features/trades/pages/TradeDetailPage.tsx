import { useParams, useNavigate } from "react-router-dom";
import { Pencil } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EmotionBadge } from "@/components/common/EmotionBadge";
import { BrokerBadge } from "@/components/common/BrokerBadge";
import { MistakeTag } from "@/components/common/MistakeTag";
import { ErrorState } from "@/components/common/ErrorState";
import { PageHeader } from "@/components/common/PageHeader";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency, formatDateTime, pnlClass } from "@/lib/utils";
import { useTradeDetails } from "../hooks";
import { JournalPanel } from "../components/JournalPanel";
import { ChecklistPanel } from "../components/ChecklistPanel";
import { EmotionsPanel } from "../components/EmotionsPanel";
import { TradeReviewPanel } from "@/features/trade-review/components/TradeReviewPanel";

export default function TradeDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: trade, isLoading, error } = useTradeDetails(id ?? "");

  if (isLoading) return <Skeleton className="h-96 w-full rounded-lg" />;
  if (error) return <ErrorState error={error} />;
  if (!trade) return null;

  const stats: { label: string; value: string; className?: string }[] = [
    { label: "Symbol", value: trade.symbol },
    { label: "Side", value: trade.side },
    { label: "Quantity", value: String(trade.quantity) },
    { label: "Entry price", value: formatCurrency(trade.entryPrice) },
    { label: "Exit price", value: formatCurrency(trade.exitPrice) },
    {
      label: "Net P&L",
      value: formatCurrency(trade.netPnl),
      className: pnlClass(trade.netPnl),
    },
    { label: "Strategy", value: trade.strategy?.name ?? "—" },
    { label: "Entry time", value: formatDateTime(trade.entryTime) },
  ];

  return (
    <div>
      <PageHeader
        title={trade.symbol}
        description={`${trade.segment} · ${trade.product}`}
        actions={
          <div className="flex items-center gap-2">
            <Badge variant="outline">{trade.status}</Badge>
            <BrokerBadge broker={trade.broker} />
            <Button
              variant="outline"
              onClick={() => navigate(`/trades/${trade.id}/edit`)}
            >
              <Pencil className="size-4" />
              Edit
            </Button>
          </div>
        }
      />

      <Card className="mb-4">
        <CardContent className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label}>
              <p className="text-eyebrow">{s.label}</p>
              <p className={`mt-1 font-medium ${s.className ?? ""}`}>{s.value}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardContent className="flex flex-wrap items-center gap-6">
          <div>
            <p className="text-eyebrow mb-1.5">Emotions</p>
            <div className="flex gap-2">
              {trade.emotionBefore ? (
                <EmotionBadge emotion={trade.emotionBefore} />
              ) : (
                <span className="text-sm text-muted-foreground">Before: —</span>
              )}
              {trade.emotionAfter ? (
                <EmotionBadge emotion={trade.emotionAfter} />
              ) : (
                <span className="text-sm text-muted-foreground">After: —</span>
              )}
            </div>
          </div>

          <div>
            <p className="text-eyebrow mb-1.5">Confidence</p>
            <div className="flex items-center gap-2">
              <Progress value={(trade.confidence / 10) * 100} className="w-32" />
              <span className="text-sm text-muted-foreground">
                {trade.confidence}/10
              </span>
            </div>
          </div>

          {trade.mistakes.length > 0 && (
            <div>
              <p className="text-eyebrow mb-1.5">Mistakes tagged</p>
              <div className="flex flex-wrap gap-1.5">
                {trade.mistakes.map((m) => (
                  <MistakeTag key={m.id} name={m.name} />
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Tabs defaultValue="journal">
        <TabsList>
          <TabsTrigger value="journal">Journal</TabsTrigger>
          <TabsTrigger value="checklist">Checklist</TabsTrigger>
          <TabsTrigger value="emotions">Emotions</TabsTrigger>
          <TabsTrigger value="review">AI Review</TabsTrigger>
        </TabsList>

        <TabsContent value="journal" className="mt-4">
          <JournalPanel tradeId={trade.id} />
        </TabsContent>

        <TabsContent value="checklist" className="mt-4">
          <ChecklistPanel tradeId={trade.id} />
        </TabsContent>

        <TabsContent value="emotions" className="mt-4">
          <EmotionsPanel tradeId={trade.id} />
        </TabsContent>

        <TabsContent value="review" className="mt-4">
          <TradeReviewPanel tradeId={trade.id} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
