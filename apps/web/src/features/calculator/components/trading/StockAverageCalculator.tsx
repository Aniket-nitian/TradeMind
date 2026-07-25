import { zodResolver } from "@hookform/resolvers/zod";
import { Layers } from "lucide-react";
import { useForm } from "react-hook-form";
import type { z } from "zod";

import { formatCurrency } from "@/lib/utils";
import { useStockAverageCalculator } from "../../hooks";
import { stockAverageSchema } from "../../lib/schemas";
import { CalculatorCard } from "../shared/CalculatorCard";
import { NumberField } from "../shared/NumberField";
import { ResultStatGrid } from "../shared/ResultStatGrid";

export function StockAverageCalculator() {
  const mutation = useStockAverageCalculator();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<z.input<typeof stockAverageSchema>, unknown, z.infer<typeof stockAverageSchema>>({
    resolver: zodResolver(stockAverageSchema),
  });

  const onSubmit = handleSubmit((values) => mutation.mutate(values));

  const handleReset = () => {
    reset();
    mutation.reset();
  };

  return (
    <CalculatorCard
      icon={Layers}
      title="Stock Averaging"
      description="Blend two buy lots into a single average price."
      onSubmit={onSubmit}
      isPending={mutation.isPending}
      hasResult={!!mutation.data}
      onReset={handleReset}
      result={
        mutation.data && (
          <ResultStatGrid
            stats={[
              { label: "Total quantity", value: String(mutation.data.totalQuantity) },
              { label: "Total investment", value: formatCurrency(mutation.data.totalInvestment) },
              { label: "Average price", value: formatCurrency(mutation.data.averagePrice) },
            ]}
          />
        )
      }
    >
      <div className="grid grid-cols-2 gap-3">
        <NumberField
          label="1st Qty"
          registration={register("firstQuantity")}
          error={errors.firstQuantity}
        />
        <NumberField
          label="1st Price"
          registration={register("firstPrice")}
          error={errors.firstPrice}
          prefix="₹"
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <NumberField
          label="2nd Qty"
          registration={register("secondQuantity")}
          error={errors.secondQuantity}
        />
        <NumberField
          label="2nd Price"
          registration={register("secondPrice")}
          error={errors.secondPrice}
          prefix="₹"
        />
      </div>
    </CalculatorCard>
  );
}
