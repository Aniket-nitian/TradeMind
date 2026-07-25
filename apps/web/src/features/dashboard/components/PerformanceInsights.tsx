import { useNavigate } from "react-router-dom";
import { AlertTriangle, Sparkles, Target, TrendingDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { usePerformanceCoach } from "@/features/performance-coach/hooks";
import { useDemoGate } from "@/features/demo/DemoModeContext";

const ICONS = [AlertTriangle, TrendingDown, Target];

export function PerformanceInsights() {
  const navigate = useNavigate();
  const { requireAuth } = useDemoGate();
  const { data, isLoading, isError } = usePerformanceCoach();

  return (
    <Card className="flex h-full flex-col">
      <CardContent className="flex flex-1 flex-col gap-3">
        <p className="flex items-center gap-1.5 text-sm font-semibold">
          <Sparkles className="size-4 text-primary" />
          AI Insights
        </p>

        {isLoading && (
          <div className="flex flex-col gap-2">
            <Skeleton className="h-16 w-full rounded-lg" />
            <Skeleton className="h-16 w-full rounded-lg" />
          </div>
        )}

        {isError && (
          <p className="text-sm text-muted-foreground">
            Log a few more trades to unlock AI insights.
          </p>
        )}

        {data && (
          <div className="flex flex-col gap-2">
            {[...data.focusAreas.slice(0, 2), data.trajectory.observation].map(
              (text, i) => {
                const Icon = ICONS[i % ICONS.length];
                return (
                  <div
                    key={i}
                    className="flex items-start gap-2.5 rounded-lg border border-border p-3 text-sm"
                  >
                    <Icon className="mt-0.5 size-4 shrink-0 text-warning" />
                    <span>{text}</span>
                  </div>
                );
              }
            )}
          </div>
        )}

        <Button
          variant="outline"
          className="mt-auto w-full uppercase"
          onClick={() => requireAuth() && navigate("/chat")}
        >
          View full report
        </Button>
      </CardContent>
    </Card>
  );
}
