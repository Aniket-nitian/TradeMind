import { zodResolver } from "@hookform/resolvers/zod";
import { Receipt } from "lucide-react";
import { useForm } from "react-hook-form";
import type { z } from "zod";

import { formatCurrency, pnlClass } from "@/lib/utils";
import { useBrokerageCalculator } from "../../hooks";
import { brokerageSchema } from "../../lib/schemas";
import { CalculatorCard } from "../shared/CalculatorCard";
import { NumberField } from "../shared/NumberField";
import { ResultStatGrid } from "../shared/ResultStatGrid";

export function BrokerageCalculator() {
  const mutation = useBrokerageCalculator();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<z.input<typeof brokerageSchema>, unknown, z.infer<typeof brokerageSchema>>({
    resolver: zodResolver(brokerageSchema),
  });

  const onSubmit = handleSubmit((values) => mutation.mutate(values));

  const handleReset = () => {
    reset();
    mutation.reset();
  };

  return (
    <CalculatorCard
      icon={Receipt}
      title="Brokerage & Net P&L"
      description="Work out turnover, brokerage cost, and net P&L on a round trip."
      onSubmit={onSubmit}
      isPending={mutation.isPending}
      hasResult={!!mutation.data}
      onReset={handleReset}
      result={
        mutation.data && (
          <ResultStatGrid
            stats={[
              { label: "Turnover", value: formatCurrency(mutation.data.turnover) },
              { label: "Brokerage", value: formatCurrency(mutation.data.brokerage) },
              { label: "Gross P&L", value: formatCurrency(mutation.data.grossPnL), valueClassName: pnlClass(mutation.data.grossPnL) },
              { label: "Net P&L", value: formatCurrency(mutation.data.netPnL), valueClassName: pnlClass(mutation.data.netPnL) },
            ]}
          />
        )
      }
    >
      <NumberField
        label="Buy Price"
        registration={register("buyPrice")}
        error={errors.buyPrice}
        prefix="₹"
      />
      <NumberField
        label="Sell Price"
        registration={register("sellPrice")}
        error={errors.sellPrice}
        prefix="₹"
      />
      <NumberField
        label="Quantity"
        registration={register("quantity")}
        error={errors.quantity}
      />
      <NumberField
        label="Brokerage / Order"
        registration={register("brokeragePerOrder")}
        error={errors.brokeragePerOrder}
        prefix="₹"
      />
    </CalculatorCard>
  );
}
