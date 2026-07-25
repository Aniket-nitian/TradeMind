import { Controller, type UseFormReturn } from "react-hook-form";

import { Input } from "@/components/ui/input";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useStrategies } from "@/features/strategies/hooks";
import type { WizardFormInput } from "./schema";

export function Step2RiskStrategy({ form }: { form: UseFormReturn<WizardFormInput> }) {
  const { register, control, watch } = form;
  const { data: strategies } = useStrategies();
  const confidence = Number(watch("confidence") || 5);

  return (
    <FieldGroup>
      <div className="grid grid-cols-2 gap-5">
        <Field>
          <FieldLabel htmlFor="stopLoss" className="text-destructive">
            Stop loss
          </FieldLabel>
          <Input
            id="stopLoss"
            type="number"
            step="any"
            className="h-11 rounded-xl px-3.5"
            {...register("stopLoss")}
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="target" className="text-success">
            Target
          </FieldLabel>
          <Input
            id="target"
            type="number"
            step="any"
            className="h-11 rounded-xl px-3.5"
            {...register("target")}
          />
        </Field>
      </div>

      <Field>
        <FieldLabel>Trading strategy</FieldLabel>
        <Controller
          control={control}
          name="strategyId"
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger className="!h-11 w-full rounded-xl px-3.5">
                <SelectValue placeholder="None" />
              </SelectTrigger>
              <SelectContent>
                {strategies?.map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </Field>

      <Field>
        <FieldLabel>Confidence level (1-10)</FieldLabel>
        <div className="rounded-xl border border-border bg-muted/20 p-4">
          <Controller
            control={control}
            name="confidence"
            render={({ field }) => (
              <div className="flex items-center gap-4">
                <Slider
                  min={1}
                  max={10}
                  step={1}
                  value={[confidence]}
                  onValueChange={(v) => field.onChange(Array.isArray(v) ? v[0] : v)}
                  className="flex-1"
                />
                <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-sm font-semibold text-primary">
                  {confidence}
                </span>
              </div>
            )}
          />
          <div className="mt-2 flex justify-between text-xs text-muted-foreground">
            <span>Cautious</span>
            <span>Aggressive</span>
          </div>
        </div>
      </Field>
    </FieldGroup>
  );
}
