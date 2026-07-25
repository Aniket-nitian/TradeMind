import { zodResolver } from "@hookform/resolvers/zod";
import { TrendingUp } from "lucide-react";
import { useForm } from "react-hook-form";
import type { z } from "zod";

import { useCagrCalculator } from "../../hooks";
import { cagrSchema } from "../../lib/schemas";
import { CalculatorCard } from "../shared/CalculatorCard";
import { NumberField } from "../shared/NumberField";
import { ResultStatGrid } from "../shared/ResultStatGrid";

export function CagrCalculator() {
  const mutation = useCagrCalculator();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<z.input<typeof cagrSchema>, unknown, z.infer<typeof cagrSchema>>({
    resolver: zodResolver(cagrSchema),
  });

  const onSubmit = handleSubmit((values) => mutation.mutate(values));

  const handleReset = () => {
    reset();
    mutation.reset();
  };

  return (
    <CalculatorCard
      icon={TrendingUp}
      title="CAGR"
      description="Annualized growth rate between an initial and final value."
      onSubmit={onSubmit}
      isPending={mutation.isPending}
      hasResult={!!mutation.data}
      onReset={handleReset}
      result={
        mutation.data && (
          <ResultStatGrid stats={[{ label: "CAGR", value: `${mutation.data.cagr}%` }]} />
        )
      }
    >
      <NumberField
        label="Initial Value"
        registration={register("initialValue")}
        error={errors.initialValue}
        prefix="₹"
      />
      <NumberField
        label="Final Value"
        registration={register("finalValue")}
        error={errors.finalValue}
        prefix="₹"
      />
      <NumberField label="Years" registration={register("years")} error={errors.years} />
    </CalculatorCard>
  );
}
