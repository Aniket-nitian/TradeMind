import { ChevronLeft } from "lucide-react";
import { Link, Navigate, useParams } from "react-router-dom";

import { getCalculatorEntry } from "../lib/registry";

export default function CalculatorDetailPage() {
  const { calculatorId } = useParams<{ calculatorId: string }>();
  const entry = calculatorId ? getCalculatorEntry(calculatorId) : undefined;

  if (!entry) {
    return <Navigate to="/calculator" replace />;
  }

  const { Component } = entry;

  return (
    <div>
      <Link
        to="/calculator"
        className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ChevronLeft className="size-4" />
        Back to calculators
      </Link>

      <Component />
    </div>
  );
}
