import { zodResolver } from "@hookform/resolvers/zod";
import { Target } from "lucide-react";
import { useForm } from "react-hook-form";
import type { z } from "zod";

import { formatCurrency } from "@/lib/utils";
import { useGoalCalculator } from "../../hooks";
import { goalSchema } from "../../lib/schemas";
import { CalculatorCard } from "../shared/CalculatorCard";
import { NumberField } from "../shared/NumberField";
import { ResultStatGrid } from "../shared/ResultStatGrid";

export function GoalCalculator() {
  const mutation = useGoalCalculator();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<z.input<typeof goalSchema>, unknown, z.infer<typeof goalSchema>>({
    resolver: zodResolver(goalSchema),
  });

  const onSubmit = handleSubmit((values) => mutation.mutate(values));

  const handleReset = () => {
    reset();
    mutation.reset();
  };

  return (
    <CalculatorCard
      icon={Target}
      title="Goal Planning"
      description="Required monthly SIP to reach a target corpus."
      onSubmit={onSubmit}
      isPending={mutation.isPending}
      hasResult={!!mutation.data}
      onReset={handleReset}
      result={
        mutation.data && (
          <ResultStatGrid
            stats={[
              { label: "Monthly SIP needed", value: formatCurrency(mutation.data.monthlyInvestment) },
              { label: "Target amount", value: formatCurrency(mutation.data.targetAmount) },
            ]}
          />
        )
      }
    >
      <NumberField
        label="Target Amount"
        registration={register("targetAmount")}
        error={errors.targetAmount}
        prefix="₹"
      />
      <NumberField
        label="Annual Return"
        registration={register("annualReturn")}
        error={errors.annualReturn}
        suffix="%"
      />
      <NumberField label="Years" registration={register("years")} error={errors.years} />
    </CalculatorCard>
  );
}
