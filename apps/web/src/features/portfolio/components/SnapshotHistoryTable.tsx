import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency, formatDateTime, pnlClass } from "@/lib/utils";
import type { PortfolioSnapshot } from "../types";

export function SnapshotHistoryTable({ snapshots }: { snapshots: PortfolioSnapshot[] }) {
  if (snapshots.length === 0) {
    return <p className="text-sm text-muted-foreground">No snapshots yet.</p>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Total value</TableHead>
          <TableHead>Invested</TableHead>
          <TableHead>Unrealized</TableHead>
          <TableHead>Realized</TableHead>
          <TableHead>Cash</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {snapshots.map((snap) => (
          <TableRow key={snap.id}>
            <TableCell>{formatDateTime(snap.createdAt)}</TableCell>
            <TableCell className="font-medium">{formatCurrency(snap.totalValue)}</TableCell>
            <TableCell>{formatCurrency(snap.invested)}</TableCell>
            <TableCell className={snap.unrealizedPnl !== null ? pnlClass(snap.unrealizedPnl) : undefined}>
              {snap.unrealizedPnl !== null ? formatCurrency(snap.unrealizedPnl) : "—"}
            </TableCell>
            <TableCell className={pnlClass(snap.realizedPnl)}>
              {formatCurrency(snap.realizedPnl)}
            </TableCell>
            <TableCell>{formatCurrency(snap.cash)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
