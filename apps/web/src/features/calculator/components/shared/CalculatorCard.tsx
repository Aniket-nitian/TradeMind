import type { FormEvent, ReactNode } from "react";
import { Calculator as CalculatorIcon, type LucideIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface CalculatorCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  isPending: boolean;
  hasResult: boolean;
  onReset: () => void;
  children: ReactNode;
  result?: ReactNode;
}

export function CalculatorCard({
  icon: Icon,
  title,
  description,
  onSubmit,
  isPending,
  hasResult,
  onReset,
  children,
  result,
}: CalculatorCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Icon className="size-5 text-primary" />
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>

      <CardContent className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          {children}

          <div className="flex items-center gap-2">
            <Button type="submit" disabled={isPending} className="flex-1">
              {isPending ? "Calculating…" : "Calculate"}
            </Button>
            {hasResult && (
              <Button type="button" variant="ghost" onClick={onReset}>
                Reset
              </Button>
            )}
          </div>
        </form>

        <div className="rounded-xl bg-muted/40 p-4">
          {hasResult ? (
            result
          ) : (
            <div className="flex h-full min-h-48 flex-col items-center justify-center gap-2 text-center">
              <CalculatorIcon className="size-6 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Enter values and calculate to see your results here.
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
