import { Brain, Sparkles, Target, TrendingUp } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { InsightCard } from "@/components/common/InsightCard";
import { Skeleton } from "@/components/ui/skeleton";
import { usePerformanceCoach } from "@/features/performance-coach/hooks";
import { usePsychologyCoach } from "@/features/psychology-coach/hooks";
import { useStrategyAdvisor } from "@/features/strategy-advisor/hooks";
import type { StrategyRecommendation } from "@/features/strategy-advisor/types";

const RECOMMENDATION_VARIANT: Record<StrategyRecommendation, "success" | "warning" | "destructive"> = {
  KEEP: "success",
  ADJUST: "warning",
  DROP: "destructive",
};

const PSYCH_TRAITS = [
  { key: "fear", label: "Fear" },
  { key: "greed", label: "Greed" },
  { key: "fomo", label: "FOMO" },
  { key: "revengeTrading", label: "Revenge trading" },
  { key: "overconfidence", label: "Overconfidence" },
  { key: "impulsiveness", label: "Impulsiveness" },
] as const;

export function InsightSidebar() {
  const performance = usePerformanceCoach();
  const psychology = usePsychologyCoach();
  const strategy = useStrategyAdvisor();

  const isLoading = performance.isLoading || psychology.isLoading || strategy.isLoading;
  const hasError = performance.isError && psychology.isError && strategy.isError;

  if (isLoading) {
    return (
      <div className="flex flex-col gap-3">
        <Skeleton className="h-32 w-full rounded-xl" />
        <Skeleton className="h-24 w-full rounded-xl" />
        <Skeleton className="h-24 w-full rounded-xl" />
      </div>
    );
  }

  if (hasError) {
    return (
      <Card>
        <CardContent className="text-sm text-muted-foreground">
          Insights need a bit more trade history to generate.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {performance.data && (
        <Card className="bg-gradient-to-br from-primary/20 to-primary/5">
          <CardContent className="flex flex-col gap-2">
            <p className="flex items-center gap-1.5 text-sm font-semibold">
              <Sparkles className="size-4" />
              Performance summary
            </p>
            <p className="text-sm text-muted-foreground">{performance.data.summary}</p>
            {performance.data.strengths.length > 0 && (
              <ul className="mt-1 list-inside list-disc text-xs text-success">
                {performance.data.strengths.slice(0, 3).map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      )}

      {psychology.data &&
        PSYCH_TRAITS.map(({ key, label }) => {
          const trait = psychology.data[key];
          if (!trait) return null;
          return (
            <InsightCard
              key={key}
              icon={<Brain className="size-4" />}
              category="Behavioral"
              categoryVariant="warning"
              title={label}
              description={trait.coaching}
              footer={trait.observation}
            />
          );
        })}

      {strategy.data?.strategies.map((s) => (
        <InsightCard
          key={s.name}
          icon={<Target className="size-4" />}
          category={s.recommendation}
          categoryVariant={RECOMMENDATION_VARIANT[s.recommendation]}
          title={s.name}
          description={s.coaching}
          footer={s.observation}
        />
      ))}

      {performance.data && (
        <InsightCard
          icon={<TrendingUp className="size-4" />}
          category="Trajectory"
          title="Where you're headed"
          description={performance.data.trajectory.coaching}
          footer={performance.data.trajectory.observation}
        />
      )}
    </div>
  );
}
