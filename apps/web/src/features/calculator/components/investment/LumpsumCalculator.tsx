import { zodResolver } from "@hookform/resolvers/zod";
import { Landmark } from "lucide-react";
import { useForm } from "react-hook-form";
import type { z } from "zod";

import { Progress } from "@/components/ui/progress";
import { formatCurrency } from "@/lib/utils";
import { useLumpsumCalculator } from "../../hooks";
import { lumpsumSchema } from "../../lib/schemas";
import { CalculatorCard } from "../shared/CalculatorCard";
import { NumberField } from "../shared/NumberField";
import { ResultStatGrid } from "../shared/ResultStatGrid";

export function LumpsumCalculator() {
  const mutation = useLumpsumCalculator();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<z.input<typeof lumpsumSchema>, unknown, z.infer<typeof lumpsumSchema>>({
    resolver: zodResolver(lumpsumSchema),
  });

  const onSubmit = handleSubmit((values) => mutation.mutate(values));

  const handleReset = () => {
    reset();
    mutation.reset();
  };

  const gainedPercent = mutation.data
    ? (mutation.data.wealthGained / mutation.data.maturityAmount) * 100
    : 0;

  return (
    <CalculatorCard
      icon={Landmark}
      title="Lumpsum Investment"
      description="Maturity value of a one-time investment, compounded annually."
      onSubmit={onSubmit}
      isPending={mutation.isPending}
      hasResult={!!mutation.data}
      onReset={handleReset}
      result={
        mutation.data && (
          <div className="flex flex-col gap-3">
            <ResultStatGrid
              stats={[
                { label: "Invested", value: formatCurrency(mutation.data.investedAmount) },
                { label: "Maturity value", value: formatCurrency(mutation.data.maturityAmount) },
                { label: "Wealth gained", value: formatCurrency(mutation.data.wealthGained), valueClassName: "text-success" },
              ]}
            />
            <div>
              <div className="mb-1 flex items-center justify-between text-xs text-muted-foreground">
                <span>Wealth gained</span>
                <span>{gainedPercent.toFixed(1)}% of maturity value</span>
              </div>
              <Progress value={gainedPercent} />
            </div>
          </div>
        )
      }
    >
      <NumberField
        label="Principal"
        registration={register("principal")}
        error={errors.principal}
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
