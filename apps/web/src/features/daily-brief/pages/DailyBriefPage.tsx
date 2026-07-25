import {
  AlertTriangle,
  Brain,
  CheckCircle2,
  Gauge,
  Newspaper,
  ShieldCheck,
  Sparkles,
  Target,
} from "lucide-react";

import { PageHeader } from "@/components/common/PageHeader";
import { ErrorState } from "@/components/common/ErrorState";
import { InsightCard } from "@/components/common/InsightCard";
import { UpgradeBanner } from "@/components/common/UpgradeBanner";
import { CardGridSkeleton } from "@/components/common/LoadingSkeletons";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { isPremiumRequired } from "@/lib/api/normalize-error";
import { useDailyBrief } from "../hooks";

export default function DailyBriefPage() {
  const { data, isLoading, error } = useDailyBrief();

  return (
    <div>
      <PageHeader title="Daily Brief" description="Your AI-generated pre-market briefing." />

      {isLoading && <CardGridSkeleton count={6} />}

      {error && (isPremiumRequired(error) ? <UpgradeBanner error={error} /> : <ErrorState error={error} />)}

      {data && (
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gauge className="size-4" />
                  Yesterday
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{data.previousDaySummary}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Newspaper className="size-4" />
                  Market summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{data.marketSummary}</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="size-4" />
                Pre-market checklist
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="flex flex-col gap-2">
                {data.tradingChecklist.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <ShieldCheck className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                    {item}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <div className="flex items-start gap-3 rounded-lg border border-warning/30 bg-warning/5 p-4">
            <AlertTriangle className="mt-0.5 size-5 shrink-0 text-warning" />
            <div>
              <p className="font-medium">Risk reminder</p>
              <p className="text-sm text-muted-foreground">{data.riskReminder}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            <InsightCard
              icon={<Brain className="size-4" />}
              category="Psychology"
              categoryVariant="warning"
              title="Psychology"
              description={data.psychology.coaching}
              footer={data.psychology.observation}
            />
            <InsightCard
              icon={<ShieldCheck className="size-4" />}
              category="Discipline"
              categoryVariant="secondary"
              title="Discipline"
              description={data.discipline.coaching}
              footer={data.discipline.observation}
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
              icon={<Target className="size-4" />}
              category="Execution"
              categoryVariant="secondary"
              title="Execution"
              description={data.execution.coaching}
              footer={data.execution.observation}
            />
            <InsightCard
              icon={<Gauge className="size-4" />}
              category="Confidence"
              categoryVariant="secondary"
              title="Confidence"
              description={data.confidence.coaching}
              footer={data.confidence.observation}
            />
            <InsightCard
              icon={<Sparkles className="size-4" />}
              category="Improvement"
              categoryVariant="default"
              title="One thing to improve"
              description={data.improvement.coaching}
              footer={data.improvement.observation}
            />
          </div>
        </div>
      )}
    </div>
  );
}
