import { useState } from "react";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRecordCapital } from "../hooks";
import type { CapitalTransactionType } from "../types";

export function AddCapitalDialog() {
  const [open, setOpen] = useState(false);
  const [type, setType] = useState<CapitalTransactionType>("DEPOSIT");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [date, setDate] = useState("");

  const recordCapital = useRecordCapital();

  const resetFields = () => {
    setType("DEPOSIT");
    setAmount("");
    setNote("");
    setDate("");
  };

  const closeDialog = () => {
    setOpen(false);
    resetFields();
  };

  const parsedAmount = Number(amount);
  const canSubmit = amount.trim() !== "" && parsedAmount > 0;

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <Plus className="size-4" />
        Add transaction
      </Button>

      <Dialog open={open} onOpenChange={(next) => (next ? setOpen(true) : closeDialog())}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add capital transaction</DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-4">
            <Field>
              <FieldLabel>Type</FieldLabel>
              <Select
                value={type}
                onValueChange={(value) => setType(value as CapitalTransactionType)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DEPOSIT">Deposit</SelectItem>
                  <SelectItem value="WITHDRAWAL">Withdrawal</SelectItem>
                </SelectContent>
              </Select>
            </Field>

            <Field>
              <FieldLabel htmlFor="capital-amount">Amount</FieldLabel>
              <Input
                id="capital-amount"
                type="number"
                inputMode="decimal"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="capital-date">Date</FieldLabel>
              <Input
                id="capital-date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="capital-note">Note</FieldLabel>
              <Input
                id="capital-note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Optional"
              />
            </Field>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={closeDialog}>
              Cancel
            </Button>
            <Button
              disabled={!canSubmit || recordCapital.isPending}
              onClick={() =>
                recordCapital.mutate(
                  {
                    type,
                    amount: parsedAmount,
                    note: note.trim() || undefined,
                    transactionDate: date ? new Date(date).toISOString() : undefined,
                  },
                  { onSuccess: closeDialog }
                )
              }
            >
              {recordCapital.isPending ? "Saving…" : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
