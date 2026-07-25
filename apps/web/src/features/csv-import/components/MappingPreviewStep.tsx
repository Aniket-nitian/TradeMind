import { AlertTriangle, CheckCircle2, Sparkles } from "lucide-react";

import { StatTile } from "@/features/dashboard/components/StatTile";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency, formatDate } from "@/lib/utils";
import { BROKER_LABELS, type Broker } from "@/features/broker/types";
import type { CsvPreviewResult } from "../types";

export function MappingPreviewStep({ result }: { result: CsvPreviewResult }) {
  return (
    <div className="flex flex-col gap-6">
      {result.detectedBroker && (
        <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Sparkles className="size-4 text-primary" />
          Detected as a {BROKER_LABELS[result.detectedBroker as Broker] ?? result.detectedBroker}{" "}
          export — no broker was selected, so this was recognized automatically.
        </p>
      )}

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
        <StatTile label="Total rows" value={String(result.totalRows)} />
        <StatTile label="Valid" value={String(result.validRows)} valueClassName="text-success" />
        <StatTile
          label="Invalid"
          value={String(result.invalidRows)}
          valueClassName={result.invalidRows > 0 ? "text-destructive" : undefined}
        />
        <StatTile
          label="Duplicates"
          value={String(result.duplicateRows)}
          valueClassName={result.duplicateRows > 0 ? "text-warning" : undefined}
        />
        <StatTile label="Ready to import" value={String(result.readyToImport)} />
      </div>

      {result.duplicateRows > 0 && (
        <p className="text-xs text-muted-foreground">
          {result.duplicateRows} duplicate row(s) were detected and excluded — individual
          duplicate rows aren&apos;t identified, only the count.
        </p>
      )}

      <div>
        <p className="mb-2 flex items-center gap-1.5 text-sm font-medium">
          <CheckCircle2 className="size-4 text-success" />
          Ready to import ({result.preview.length} shown)
        </p>
        {result.preview.length === 0 ? (
          <p className="text-sm text-muted-foreground">No valid rows to preview.</p>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Symbol</TableHead>
                  <TableHead>Side</TableHead>
                  <TableHead>Qty</TableHead>
                  <TableHead>Entry</TableHead>
                  <TableHead>Exit</TableHead>
                  <TableHead>Entry time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {result.preview.slice(0, 20).map((row, i) => (
                  <TableRow key={i}>
                    <TableCell className="font-medium">{row.symbol}</TableCell>
                    <TableCell>{row.side}</TableCell>
                    <TableCell>{row.quantity}</TableCell>
                    <TableCell>{formatCurrency(row.entryPrice)}</TableCell>
                    <TableCell>{formatCurrency(row.exitPrice)}</TableCell>
                    <TableCell>{formatDate(row.entryTime)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {result.errors.length > 0 && (
        <div>
          <p className="mb-2 flex items-center gap-1.5 text-sm font-medium">
            <AlertTriangle className="size-4 text-destructive" />
            {result.errors.length} row(s) with errors
          </p>
          <div className="overflow-x-auto rounded-lg border border-border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Row</TableHead>
                  <TableHead>Field</TableHead>
                  <TableHead>Message</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {result.errors.map((err, i) => (
                  <TableRow key={i}>
                    <TableCell>{err.row}</TableCell>
                    <TableCell>{err.field}</TableCell>
                    <TableCell className="text-destructive">{err.message}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </div>
  );
}
