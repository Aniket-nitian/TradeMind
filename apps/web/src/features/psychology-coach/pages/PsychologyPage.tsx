import { Brain } from "lucide-react";

import { PageHeader } from "@/components/common/PageHeader";
import { ErrorState } from "@/components/common/ErrorState";
import { InsightCard } from "@/components/common/InsightCard";
import { CardGridSkeleton } from "@/components/common/LoadingSkeletons";
import { Card, CardContent } from "@/components/ui/card";
import { usePsychologyCoach } from "../hooks";

const TRAITS = [
  { key: "fear", label: "Fear" },
  { key: "greed", label: "Greed" },
  { key: "fomo", label: "FOMO" },
  { key: "revengeTrading", label: "Revenge trading" },
  { key: "overconfidence", label: "Overconfidence" },
  { key: "impulsiveness", label: "Impulsiveness" },
] as const;

export default function PsychologyPage() {
  const { data, isLoading, error } = usePsychologyCoach();

  return (
    <div>
      <PageHeader
        title="Psychology"
        description="AI-analyzed behavioral patterns from your trading journal."
      />

      {isLoading && <CardGridSkeleton count={6} />}
      {error && <ErrorState error={error} />}

      {data && (
        <>
          <Card className="mb-6">
            <CardContent>
              <p className="text-sm">{data.summary}</p>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {TRAITS.map(({ key, label }) => (
              <InsightCard
                key={key}
                icon={<Brain className="size-4" />}
                category="Behavioral"
                categoryVariant="warning"
                title={label}
                description={data[key].coaching}
                footer={data[key].observation}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
