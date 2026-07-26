import { CheckCircle2, Lightbulb, ListChecks, PenLine, Repeat, ScrollText } from "lucide-react";

import { PageHeader } from "@/components/common/PageHeader";
import { ErrorState } from "@/components/common/ErrorState";
import { InsightCard } from "@/components/common/InsightCard";
import { CardGridSkeleton } from "@/components/common/LoadingSkeletons";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useJournalInsights } from "../hooks";

export default function JournalInsightsPage() {
  const { data, isLoading, error } = useJournalInsights();

  return (
    <div>
      <PageHeader
        title="Journal Insights"
        description="AI-analyzed patterns from your trade journal entries."
      />

      {isLoading && <CardGridSkeleton count={6} />}
      {error && <ErrorState error={error} />}

      {data && (
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ScrollText className="size-4" />
                Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">{data.summary}</p>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            <InsightCard
              icon={<CheckCircle2 className="size-4" />}
              category="Discipline"
              categoryVariant="secondary"
              title="Plan adherence"
              description={data.planAdherence.coaching}
              footer={data.planAdherence.observation}
            />
            <InsightCard
              icon={<PenLine className="size-4" />}
              category="Entries"
              categoryVariant="secondary"
              title="Entry reasoning quality"
              description={data.entryReasoningQuality.coaching}
              footer={data.entryReasoningQuality.observation}
            />
            <InsightCard
              icon={<PenLine className="size-4" />}
              category="Exits"
              categoryVariant="secondary"
              title="Exit reasoning quality"
              description={data.exitReasoningQuality.coaching}
              footer={data.exitReasoningQuality.observation}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Repeat className="size-4" />
                  Recurring lessons
                </CardTitle>
              </CardHeader>
              <CardContent>
                {data.recurringLessons.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Nothing recurring yet.</p>
                ) : (
                  <ul className="flex flex-col gap-2">
                    {data.recurringLessons.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <ListChecks className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
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
                  Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent>
                {data.recommendations.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No recommendations yet.</p>
                ) : (
                  <ul className="flex flex-col gap-2">
                    {data.recommendations.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <ListChecks className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
