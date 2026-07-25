import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate, formatDateTime } from "@/lib/utils";
import { BROKER_LABELS } from "../types";
import type { BrokerSyncLog } from "../types";

const STATUS_VARIANT: Record<BrokerSyncLog["status"], "success" | "warning" | "destructive" | "secondary"> = {
  COMPLETED: "success",
  PARTIAL: "warning",
  FAILED: "destructive",
  PENDING: "secondary",
};

export function SyncHistoryTable({ logs }: { logs: BrokerSyncLog[] }) {
  if (logs.length === 0) {
    return <p className="text-sm text-muted-foreground">No sync runs yet.</p>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Broker</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Range synced</TableHead>
          <TableHead>Fetched</TableHead>
          <TableHead>Matched</TableHead>
          <TableHead>Imported</TableHead>
          <TableHead>Duplicates</TableHead>
          <TableHead>Ran at</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {logs.map((log) => (
          <TableRow key={log.id}>
            <TableCell>{BROKER_LABELS[log.broker]}</TableCell>
            <TableCell>
              <Badge variant={STATUS_VARIANT[log.status]}>{log.status}</Badge>
            </TableCell>
            <TableCell className="text-muted-foreground">
              {formatDate(log.fromDate)} – {formatDate(log.toDate)}
            </TableCell>
            <TableCell>{log.totalFetched}</TableCell>
            <TableCell>{log.matchedTrades}</TableCell>
            <TableCell>{log.importedRows}</TableCell>
            <TableCell>{log.duplicateRows}</TableCell>
            <TableCell className="text-muted-foreground">{formatDateTime(log.createdAt)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
