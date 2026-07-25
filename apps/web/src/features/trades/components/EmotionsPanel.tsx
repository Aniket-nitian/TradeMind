import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { EMOTIONS } from "@/lib/constants";
import { useTradeEmotions, useUpdateEmotions } from "../hooks";

export function EmotionsPanel({ tradeId }: { tradeId: string }) {
  const { data: emotions, isLoading } = useTradeEmotions(tradeId);
  const updateEmotions = useUpdateEmotions(tradeId);

  const [before, setBefore] = useState<string | undefined>();
  const [after, setAfter] = useState<string | undefined>();

  useEffect(() => {
    setBefore(emotions?.emotionBefore ?? undefined);
    setAfter(emotions?.emotionAfter ?? undefined);
  }, [emotions]);

  if (isLoading) {
    return <Skeleton className="h-40 w-full rounded-lg" />;
  }

  return (
    <div className="flex flex-col gap-4">
      <Field>
        <FieldLabel>Emotion before entry</FieldLabel>
        <Select value={before} onValueChange={(v) => setBefore(v ?? undefined)}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Not set" />
          </SelectTrigger>
          <SelectContent>
            {EMOTIONS.map((e) => (
              <SelectItem key={e} value={e}>
                {e}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>

      <Field>
        <FieldLabel>Emotion after exit</FieldLabel>
        <Select value={after} onValueChange={(v) => setAfter(v ?? undefined)}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Not set" />
          </SelectTrigger>
          <SelectContent>
            {EMOTIONS.map((e) => (
              <SelectItem key={e} value={e}>
                {e}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>

      <div className="flex justify-end">
        <Button
          disabled={updateEmotions.isPending}
          onClick={() =>
            updateEmotions.mutate({ emotionBefore: before, emotionAfter: after })
          }
        >
          {updateEmotions.isPending ? "Saving…" : "Save emotions"}
        </Button>
      </div>
    </div>
  );
}
