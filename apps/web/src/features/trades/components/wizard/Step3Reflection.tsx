import { Controller, type UseFormReturn } from "react-hook-form";

import { Badge } from "@/components/ui/badge";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { EMOTIONS } from "@/lib/constants";
import { EMOTION_META } from "@/lib/emotion-meta";
import { useMistakesCatalog } from "@/features/mistakes/hooks";
import type { WizardFormInput } from "./schema";

interface Step3Props {
  form: UseFormReturn<WizardFormInput>;
  selectedMistakeIds: string[];
  onToggleMistake: (id: string) => void;
}

export function Step3Reflection({ form, selectedMistakeIds, onToggleMistake }: Step3Props) {
  const { register, control } = form;
  const { data: mistakes } = useMistakesCatalog();

  return (
    <FieldGroup>
      <Field>
        <FieldLabel>Pre-trade emotion</FieldLabel>
        <Controller
          control={control}
          name="emotionBefore"
          render={({ field }) => (
            <div className="grid grid-cols-4 gap-2.5 sm:grid-cols-6">
              {EMOTIONS.map((emotion) => {
                const meta = EMOTION_META[emotion];
                const isSelected = field.value === emotion;
                return (
                  <button
                    key={emotion}
                    type="button"
                    onClick={() => field.onChange(isSelected ? undefined : emotion)}
                    className={cn(
                      "flex flex-col items-center gap-1.5 rounded-xl border p-3 text-xs font-medium transition-colors",
                      isSelected
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border hover:bg-accent"
                    )}
                  >
                    <span className="text-2xl">{meta.emoji}</span>
                    {meta.label}
                  </button>
                );
              })}
            </div>
          )}
        />
      </Field>

      <Field>
        <FieldLabel htmlFor="reasonForEntry">Reason for entry</FieldLabel>
        <Textarea
          id="reasonForEntry"
          placeholder="Describe the technical/fundamental triggers…"
          className="min-h-24 rounded-xl px-3.5 py-3"
          {...register("reasonForEntry")}
        />
      </Field>

      <Field>
        <FieldLabel htmlFor="reasonForExit">Reason for exit</FieldLabel>
        <Textarea
          id="reasonForExit"
          placeholder="Only if the trade is already closed…"
          className="min-h-24 rounded-xl px-3.5 py-3"
          {...register("reasonForExit")}
        />
      </Field>

      <Field>
        <FieldLabel htmlFor="tradeNotes">Trade notes</FieldLabel>
        <Textarea
          id="tradeNotes"
          className="min-h-24 rounded-xl px-3.5 py-3"
          {...register("tradeNotes")}
        />
      </Field>

      <Field>
        <FieldLabel htmlFor="lessonLearned">Lesson learned</FieldLabel>
        <Textarea
          id="lessonLearned"
          className="min-h-24 rounded-xl px-3.5 py-3"
          {...register("lessonLearned")}
        />
      </Field>

      <Field>
        <FieldLabel>Mistakes tagging</FieldLabel>
        <div className="flex flex-wrap gap-2">
          {mistakes?.length ? (
            mistakes.map((m) => {
              const isSelected = selectedMistakeIds.includes(m.id);
              return (
                <Badge
                  key={m.id}
                  variant={isSelected ? "warning" : "outline"}
                  className="cursor-pointer"
                  onClick={() => onToggleMistake(m.id)}
                >
                  {m.name}
                </Badge>
              );
            })
          ) : (
            <p className="text-sm text-muted-foreground">
              No mistake tags yet — add some from the Mistakes settings later.
            </p>
          )}
        </div>
      </Field>
    </FieldGroup>
  );
}
