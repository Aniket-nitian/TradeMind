import { StatTile } from "@/features/dashboard/components/StatTile";
import { formatCurrency, pnlClass } from "@/lib/utils";
import type { PortfolioValue } from "../types";

export function PortfolioSummary({ value }: { value: PortfolioValue }) {
  return (
    <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
      <StatTile label="Total value" value={formatCurrency(value.totalValue)} />
      <StatTile label="Invested" value={formatCurrency(value.invested)} />
      <StatTile
        label="Unrealized P&L"
        value={formatCurrency(value.unrealizedPnl)}
        valueClassName={pnlClass(value.unrealizedPnl)}
      />
      <StatTile
        label="Realized P&L"
        value={formatCurrency(value.realizedPnl)}
        valueClassName={pnlClass(value.realizedPnl)}
      />
      <StatTile label="Cash" value={formatCurrency(value.cash)} />
    </div>
  );
}
