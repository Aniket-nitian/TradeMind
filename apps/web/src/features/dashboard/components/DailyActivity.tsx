import { useNavigate } from "react-router-dom";
import { ShoppingCart, Tag } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, formatDateTime, pnlClass } from "@/lib/utils";
import { useDemoGate } from "@/features/demo/DemoModeContext";
import type { Trade } from "@/features/trades/types";

export function DailyActivity({ trades }: { trades: Trade[] }) {
  const navigate = useNavigate();
  const { requireAuth } = useDemoGate();
  const recent = [...trades]
    .sort((a, b) => new Date(b.entryTime).getTime() - new Date(a.entryTime).getTime())
    .slice(0, 5);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent activity</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col">
        {recent.length === 0 && (
          <p className="text-sm text-muted-foreground">No trades logged yet.</p>
        )}
        {recent.map((trade, i) => {
          const isBuy = trade.side === "BUY";
          return (
            <button
              key={trade.id}
              onClick={() => requireAuth() && navigate(`/trades/${trade.id}`)}
              className={`flex items-center gap-3 py-2.5 text-left ${
                i < recent.length - 1 ? "border-b border-border" : ""
              }`}
            >
              <div
                className="flex size-8 shrink-0 items-center justify-center rounded-full"
                style={{
                  background: isBuy ? "color-mix(in oklch, var(--success) 20%, transparent)" : "color-mix(in oklch, var(--destructive) 20%, transparent)",
                  color: isBuy ? "var(--success)" : "var(--destructive)",
                }}
              >
                {isBuy ? <ShoppingCart className="size-4" /> : <Tag className="size-4" />}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">
                  {trade.side} {trade.symbol}
                </p>
                <p className="text-xs text-muted-foreground">
                  {trade.segment} · {formatDateTime(trade.entryTime)}
                </p>
              </div>
              <span className={`text-sm font-semibold ${pnlClass(trade.netPnl)}`}>
                {trade.netPnl === null ? "OPEN" : formatCurrency(trade.netPnl)}
              </span>
            </button>
          );
        })}
      </CardContent>
    </Card>
  );
}
