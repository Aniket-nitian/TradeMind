import { zodResolver } from "@hookform/resolvers/zod";
import { Waypoints } from "lucide-react";
import { useForm } from "react-hook-form";
import type { z } from "zod";

import { usePivotPointCalculator } from "../../hooks";
import { pivotPointSchema } from "../../lib/schemas";
import { CalculatorCard } from "../shared/CalculatorCard";
import { NumberField } from "../shared/NumberField";
import { PriceLadder } from "../shared/PriceLadder";

export function PivotPointCalculator() {
  const mutation = usePivotPointCalculator();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<z.input<typeof pivotPointSchema>, unknown, z.infer<typeof pivotPointSchema>>({
    resolver: zodResolver(pivotPointSchema),
  });

  const onSubmit = handleSubmit((values) => mutation.mutate(values));

  const handleReset = () => {
    reset();
    mutation.reset();
  };

  return (
    <CalculatorCard
      icon={Waypoints}
      title="Pivot Point"
      description="Classic floor-trader pivot with two resistance and support levels."
      onSubmit={onSubmit}
      isPending={mutation.isPending}
      hasResult={!!mutation.data}
      onReset={handleReset}
      result={
        mutation.data && (
          <PriceLadder
            rows={[
              { label: "R2", value: mutation.data.resistance2, tone: "resistance" },
              { label: "R1", value: mutation.data.resistance1, tone: "resistance" },
              { label: "Pivot", value: mutation.data.pivot, tone: "pivot" },
              { label: "S1", value: mutation.data.support1, tone: "support" },
              { label: "S2", value: mutation.data.support2, tone: "support" },
            ]}
          />
        )
      }
    >
      <NumberField label="High" registration={register("high")} error={errors.high} prefix="₹" />
      <NumberField label="Low" registration={register("low")} error={errors.low} prefix="₹" />
      <NumberField label="Close" registration={register("close")} error={errors.close} prefix="₹" />
    </CalculatorCard>
  );
}
