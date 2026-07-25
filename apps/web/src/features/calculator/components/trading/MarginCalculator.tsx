import { zodResolver } from "@hookform/resolvers/zod";
import { Wallet } from "lucide-react";
import { useForm } from "react-hook-form";
import type { z } from "zod";

import { formatCurrency } from "@/lib/utils";
import { useMarginCalculator } from "../../hooks";
import { marginSchema } from "../../lib/schemas";
import { CalculatorCard } from "../shared/CalculatorCard";
import { NumberField } from "../shared/NumberField";
import { ResultStatGrid } from "../shared/ResultStatGrid";

export function MarginCalculator() {
  const mutation = useMarginCalculator();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<z.input<typeof marginSchema>, unknown, z.infer<typeof marginSchema>>({
    resolver: zodResolver(marginSchema),
  });

  const onSubmit = handleSubmit((values) => mutation.mutate(values));

  const handleReset = () => {
    reset();
    mutation.reset();
  };

  return (
    <CalculatorCard
      icon={Wallet}
      title="Margin & Leverage"
      description="See your buying power and margin usage for a leveraged trade."
      onSubmit={onSubmit}
      isPending={mutation.isPending}
      hasResult={!!mutation.data}
      onReset={handleReset}
      result={
        mutation.data && (
          <ResultStatGrid
            stats={[
              { label: "Buying power", value: formatCurrency(mutation.data.buyingPower) },
              { label: "Quantity", value: String(mutation.data.quantity) },
              { label: "Margin used", value: formatCurrency(mutation.data.marginUsed) },
              { label: "Unused power", value: formatCurrency(mutation.data.unusedBuyingPower) },
            ]}
          />
        )
      }
    >
      <NumberField
        label="Capital"
        registration={register("capital")}
        error={errors.capital}
        prefix="₹"
      />
      <NumberField
        label="Leverage"
        registration={register("leverage")}
        error={errors.leverage}
        suffix="x"
      />
      <NumberField
        label="Entry Price"
        registration={register("entryPrice")}
        error={errors.entryPrice}
        prefix="₹"
      />
    </CalculatorCard>
  );
}
