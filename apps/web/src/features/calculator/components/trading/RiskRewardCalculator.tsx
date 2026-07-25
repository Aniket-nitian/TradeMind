import { zodResolver } from "@hookform/resolvers/zod";
import { Scale } from "lucide-react";
import { useForm } from "react-hook-form";
import type { z } from "zod";

import { formatCurrency } from "@/lib/utils";
import { useRiskRewardCalculator } from "../../hooks";
import { riskRewardSchema } from "../../lib/schemas";
import { CalculatorCard } from "../shared/CalculatorCard";
import { NumberField } from "../shared/NumberField";
import { ResultStatGrid } from "../shared/ResultStatGrid";

export function RiskRewardCalculator() {
  const mutation = useRiskRewardCalculator();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<z.input<typeof riskRewardSchema>, unknown, z.infer<typeof riskRewardSchema>>({
    resolver: zodResolver(riskRewardSchema),
  });

  const onSubmit = handleSubmit((values) => mutation.mutate(values));

  const handleReset = () => {
    reset();
    mutation.reset();
  };

  return (
    <CalculatorCard
      icon={Scale}
      title="Risk / Reward"
      description="Check the reward-to-risk ratio before you take a trade."
      onSubmit={onSubmit}
      isPending={mutation.isPending}
      hasResult={!!mutation.data}
      onReset={handleReset}
      result={
        mutation.data && (
          <ResultStatGrid
            stats={[
              { label: "Risk", value: formatCurrency(mutation.data.risk) },
              { label: "Reward", value: formatCurrency(mutation.data.reward) },
              { label: "Ratio", value: `1 : ${mutation.data.ratio}` },
            ]}
          />
        )
      }
    >
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
      <NumberField
        label="Target Price"
        registration={register("targetPrice")}
        error={errors.targetPrice}
        prefix="₹"
      />
    </CalculatorCard>
  );
}
