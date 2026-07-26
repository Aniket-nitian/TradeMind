import { AlertTriangle, Brain, Lightbulb, LogIn, LogOut, ShieldCheck } from "lucide-react";

import { ErrorState } from "@/components/common/ErrorState";
import { InsightCard } from "@/components/common/InsightCard";
import { CardGridSkeleton } from "@/components/common/LoadingSkeletons";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useTradeReview } from "../hooks";

export function TradeReviewPanel({ tradeId }: { tradeId: string }) {
  const { data, isLoading, error } = useTradeReview(tradeId);

  if (isLoading) return <CardGridSkeleton count={5} />;
  if (error) return <ErrorState error={error} />;
  if (!data) return null;

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Trade score</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center gap-3">
          <Progress value={data.score * 10} className="w-48" />
          <span className="text-sm font-medium">{data.score}/10</span>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        <InsightCard
          icon={<LogIn className="size-4" />}
          category="Entry"
          categoryVariant="secondary"
          title="Entry"
          description={data.entry.coaching}
          footer={data.entry.observation}
        />
        <InsightCard
          icon={<LogOut className="size-4" />}
          category="Exit"
          categoryVariant="secondary"
          title="Exit"
          description={data.exit.coaching}
          footer={data.exit.observation}
        />
        <InsightCard
          icon={<AlertTriangle className="size-4" />}
          category="Risk"
          categoryVariant="destructive"
          title="Risk management"
          description={data.riskManagement.coaching}
          footer={data.riskManagement.observation}
        />
        <InsightCard
          icon={<Brain className="size-4" />}
          category="Emotion"
          categoryVariant="warning"
          title="Emotion"
          description={data.emotion.coaching}
          footer={data.emotion.observation}
        />
        <InsightCard
          icon={<ShieldCheck className="size-4" />}
          category="Discipline"
          categoryVariant="secondary"
          title="Discipline"
          description={data.discipline.coaching}
          footer={data.discipline.observation}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="size-4" />
              Mistakes
            </CardTitle>
          </CardHeader>
          <CardContent>
            {data.mistakes.length === 0 ? (
              <p className="text-sm text-muted-foreground">No mistakes flagged.</p>
            ) : (
              <ul className="flex flex-col gap-2">
                {data.mistakes.map((item, i) => (
                  <li key={i} className="text-sm">
                    {item}
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="size-4" />
              Improvements
            </CardTitle>
          </CardHeader>
          <CardContent>
            {data.improvements.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nothing suggested.</p>
            ) : (
              <ul className="flex flex-col gap-2">
                {data.improvements.map((item, i) => (
                  <li key={i} className="text-sm">
                    {item}
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
