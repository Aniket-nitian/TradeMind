import { useState } from "react";
import { MoreHorizontal, Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency, formatDate } from "@/lib/utils";
import { useDeleteCapitalTransaction } from "../hooks";
import type { CapitalTransaction } from "../types";

export function CapitalLedgerTable({ transactions }: { transactions: CapitalTransaction[] }) {
  const deleteTransaction = useDeleteCapitalTransaction();
  const [pendingDelete, setPendingDelete] = useState<CapitalTransaction | null>(null);

  if (transactions.length === 0) {
    return <p className="text-sm text-muted-foreground">No capital transactions yet.</p>;
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Note</TableHead>
            <TableHead className="w-10" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((tx) => (
            <TableRow key={tx.id}>
              <TableCell>{formatDate(tx.transactionDate)}</TableCell>
              <TableCell>
                <Badge variant={tx.type === "DEPOSIT" ? "success" : "warning"}>{tx.type}</Badge>
              </TableCell>
              <TableCell>{formatCurrency(tx.amount)}</TableCell>
              <TableCell className="text-muted-foreground">{tx.note ?? "—"}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger render={<Button variant="ghost" size="icon-sm" />}>
                    <MoreHorizontal className="size-4" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem variant="destructive" onClick={() => setPendingDelete(tx)}>
                      <Trash2 className="size-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={!!pendingDelete} onOpenChange={(open) => !open && setPendingDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete transaction</DialogTitle>
            <DialogDescription>
              This will permanently delete this {pendingDelete?.type.toLowerCase()} of{" "}
              {pendingDelete && formatCurrency(pendingDelete.amount)}. This can&apos;t be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPendingDelete(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              disabled={deleteTransaction.isPending}
              onClick={() => {
                if (!pendingDelete) return;
                deleteTransaction.mutate(pendingDelete.id, {
                  onSuccess: () => setPendingDelete(null),
                });
              }}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
