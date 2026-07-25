import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import type { Payment, PaymentStatus } from "../types";

const STATUS_VARIANT: Record<PaymentStatus, "success" | "warning" | "destructive" | "secondary"> = {
  SUCCESS: "success",
  PENDING: "warning",
  FAILED: "destructive",
  REFUNDED: "secondary",
};

export function PaymentHistoryTable({ payments }: { payments: Payment[] }) {
  if (payments.length === 0) {
    return <p className="text-sm text-muted-foreground">No payments yet.</p>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Payment ID</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {payments.map((payment) => (
          <TableRow key={payment.id}>
            <TableCell>{formatDateTime(payment.createdAt)}</TableCell>
            <TableCell>{formatCurrency(payment.amount)}</TableCell>
            <TableCell>
              <Badge variant={STATUS_VARIANT[payment.status]}>{payment.status}</Badge>
            </TableCell>
            <TableCell className="text-muted-foreground">{payment.providerPaymentId}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
