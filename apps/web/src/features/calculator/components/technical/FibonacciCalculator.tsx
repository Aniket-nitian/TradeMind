import { zodResolver } from "@hookform/resolvers/zod";
import { TrendingUpDown } from "lucide-react";
import { useForm } from "react-hook-form";
import type { z } from "zod";

import { useFibonacciCalculator } from "../../hooks";
import { fibonacciSchema } from "../../lib/schemas";
import { CalculatorCard } from "../shared/CalculatorCard";
import { NumberField } from "../shared/NumberField";
import { PriceLadder, type PriceLadderRow } from "../shared/PriceLadder";

export function FibonacciCalculator() {
  const mutation = useFibonacciCalculator();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<z.input<typeof fibonacciSchema>, unknown, z.infer<typeof fibonacciSchema>>({
    resolver: zodResolver(fibonacciSchema),
  });

  const onSubmit = handleSubmit((values) => mutation.mutate(values));

  const handleReset = () => {
    reset();
    mutation.reset();
  };

  const rows: PriceLadderRow[] | undefined = mutation.data
    ? [
        { label: "High", value: mutation.data.high, tone: "resistance" },
        ...Object.entries(mutation.data.levels).map(([label, value]): PriceLadderRow => {
          const percent = Number.parseFloat(label);
          return {
            label,
            value,
            tone: percent > 50 ? "resistance" : percent < 50 ? "support" : "pivot",
          };
        }),
        { label: "Low", value: mutation.data.low, tone: "support" },
      ]
    : undefined;

  return (
    <CalculatorCard
      icon={TrendingUpDown}
      title="Fibonacci Retracement"
      description="Standard retracement levels between a swing high and low."
      onSubmit={onSubmit}
      isPending={mutation.isPending}
      hasResult={!!mutation.data}
      onReset={handleReset}
      result={rows && <PriceLadder rows={rows} />}
    >
      <NumberField label="High" registration={register("high")} error={errors.high} prefix="₹" />
      <NumberField label="Low" registration={register("low")} error={errors.low} prefix="₹" />
    </CalculatorCard>
  );
}
