import { zodResolver } from "@hookform/resolvers/zod";
import { Ruler } from "lucide-react";
import { useForm } from "react-hook-form";
import type { z } from "zod";

import { formatCurrency } from "@/lib/utils";
import { usePositionSizeCalculator } from "../../hooks";
import { positionSizeSchema } from "../../lib/schemas";
import { CalculatorCard } from "../shared/CalculatorCard";
import { NumberField } from "../shared/NumberField";
import { ResultStatGrid } from "../shared/ResultStatGrid";

export function PositionSizeCalculator() {
  const mutation = usePositionSizeCalculator();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<z.input<typeof positionSizeSchema>, unknown, z.infer<typeof positionSizeSchema>>({
    resolver: zodResolver(positionSizeSchema),
  });

  const onSubmit = handleSubmit((values) => mutation.mutate(values));

  const handleReset = () => {
    reset();
    mutation.reset();
  };

  return (
    <CalculatorCard
      icon={Ruler}
      title="Position Size"
      description="Find how many shares to buy for a given risk budget."
      onSubmit={onSubmit}
      isPending={mutation.isPending}
      hasResult={!!mutation.data}
      onReset={handleReset}
      result={
        mutation.data && (
          <ResultStatGrid
            stats={[
              { label: "Quantity", value: String(mutation.data.quantity) },
              { label: "Risk amount", value: formatCurrency(mutation.data.riskAmount) },
              { label: "Stop distance", value: formatCurrency(mutation.data.stopLossDistance) },
              { label: "Position value", value: formatCurrency(mutation.data.positionValue) },
            ]}
          />
        )
      }
    >
      <NumberField
        label="Account Size"
        registration={register("accountSize")}
        error={errors.accountSize}
        prefix="₹"
      />
      <NumberField
        label="Risk %"
        registration={register("riskPercent")}
        error={errors.riskPercent}
        suffix="%"
      />
      <NumberField
        label="Entry Price"
        registration={register("entryPrice")}
        error={errors.entryPrice}
        prefix="₹"
      />
      <NumberField
        label="Stop Loss"
        registration={register("stopLoss")}
        error={errors.stopLoss}
        prefix="₹"
      />
    </CalculatorCard>
  );
}
