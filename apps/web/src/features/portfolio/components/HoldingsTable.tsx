import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency, pnlClass } from "@/lib/utils";
import type { Holding } from "../types";

export function HoldingsTable({ holdings }: { holdings: Holding[] }) {
  if (holdings.length === 0) {
    return <p className="text-sm text-muted-foreground">No open positions.</p>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Symbol</TableHead>
          <TableHead>Segment</TableHead>
          <TableHead>Qty</TableHead>
          <TableHead>Avg price</TableHead>
          <TableHead>Invested</TableHead>
          <TableHead>Current price</TableHead>
          <TableHead>Unrealized P&amp;L</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {holdings.map((holding) => (
          <TableRow key={holding.symbol}>
            <TableCell className="font-medium">{holding.symbol}</TableCell>
            <TableCell>
              <Badge variant="outline">{holding.segment}</Badge>
            </TableCell>
            <TableCell>{holding.quantity}</TableCell>
            <TableCell>{formatCurrency(holding.avgEntryPrice)}</TableCell>
            <TableCell>{formatCurrency(holding.investedValue)}</TableCell>
            <TableCell>
              {holding.currentPrice !== null ? formatCurrency(holding.currentPrice) : "—"}
            </TableCell>
            <TableCell
              className={holding.unrealizedPnl !== null ? pnlClass(holding.unrealizedPnl) : undefined}
            >
              {holding.unrealizedPnl !== null ? (
                <>
                  {formatCurrency(holding.unrealizedPnl)}
                  <span className="ml-1 text-xs text-muted-foreground">
                    ({holding.unrealizedPnlPercent}%)
                  </span>
                </>
              ) : (
                "—"
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
