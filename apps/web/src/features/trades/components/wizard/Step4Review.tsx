import type { UseFormReturn } from "react-hook-form";

import { EmotionBadge } from "@/components/common/EmotionBadge";
import { useStrategies } from "@/features/strategies/hooks";
import { useMistakesCatalog } from "@/features/mistakes/hooks";
import type { Emotion } from "@/lib/constants";
import type { WizardFormInput } from "./schema";

function ReviewRow({ label, value }: { label: string; value?: unknown }) {
  if (value === undefined || value === null || value === "") return null;
  return (
    <div className="flex justify-between border-b border-border py-2 text-sm last:border-0">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{String(value)}</span>
    </div>
  );
}

export function Step4Review({
  form,
  mistakeIds,
}: {
  form: UseFormReturn<WizardFormInput>;
  mistakeIds: string[];
}) {
  const values = form.watch();
  const { data: strategies } = useStrategies();
  const { data: mistakes } = useMistakesCatalog();

  const strategyName = strategies?.find((s) => s.id === values.strategyId)?.name;
  const selectedMistakes = mistakes?.filter((m) => mistakeIds.includes(m.id)) ?? [];

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-lg border border-border p-4">
        <p className="text-eyebrow mb-2">Trade info</p>
        <ReviewRow label="Symbol" value={values.symbol} />
        <ReviewRow label="Side" value={values.side} />
        <ReviewRow label="Segment / Product" value={`${values.segment} / ${values.product}`} />
        <ReviewRow label="Quantity" value={values.quantity} />
        <ReviewRow label="Entry price" value={values.entryPrice} />
        <ReviewRow label="Exit price" value={values.exitPrice} />
        <ReviewRow label="Entry time" value={values.entryTime} />
        <ReviewRow label="Exit time" value={values.exitTime} />
      </div>

      <div className="rounded-lg border border-border p-4">
        <p className="text-eyebrow mb-2">Risk & strategy</p>
        <ReviewRow label="Stop loss" value={values.stopLoss} />
        <ReviewRow label="Target" value={values.target} />
        <ReviewRow label="Strategy" value={strategyName ?? "—"} />
        <ReviewRow label="Confidence" value={`${values.confidence}/10`} />
      </div>

      <div className="rounded-lg border border-border p-4">
        <p className="text-eyebrow mb-2">Mindset & reflection</p>
        {values.emotionBefore && (
          <div className="mb-2 flex items-center justify-between py-1 text-sm">
            <span className="text-muted-foreground">Pre-trade emotion</span>
            <EmotionBadge emotion={values.emotionBefore as Emotion} />
          </div>
        )}
        <ReviewRow label="Reason for entry" value={values.reasonForEntry} />
        <ReviewRow label="Reason for exit" value={values.reasonForExit} />
        <ReviewRow label="Trade notes" value={values.tradeNotes} />
        <ReviewRow label="Lesson learned" value={values.lessonLearned} />
        {selectedMistakes.length > 0 && (
          <div className="pt-2 text-sm">
            <span className="text-muted-foreground">Mistakes: </span>
            {selectedMistakes.map((m) => m.name).join(", ")}
          </div>
        )}
      </div>
    </div>
  );
}
