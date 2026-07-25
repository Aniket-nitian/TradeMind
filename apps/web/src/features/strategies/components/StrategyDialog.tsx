import { useEffect, useState } from "react";

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
import { Textarea } from "@/components/ui/textarea";
import type { Strategy } from "@/features/trades/types";
import type { StrategyInput } from "../api";
import { useCreateStrategy, useUpdateStrategy } from "../hooks";

const EMPTY: StrategyInput = {
  name: "",
  description: "",
  timeframe: "",
  market: "",
  setupRules: "",
  entryRules: "",
  exitRules: "",
  riskRules: "",
};

export function StrategyDialog({
  strategy,
  open,
  onOpenChange,
}: {
  strategy: Strategy | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [fields, setFields] = useState<StrategyInput>(EMPTY);
  const createStrategy = useCreateStrategy();
  const updateStrategy = useUpdateStrategy();
  const isEdit = Boolean(strategy);
  const isPending = createStrategy.isPending || updateStrategy.isPending;

  useEffect(() => {
    if (open) {
      setFields(
        strategy
          ? {
              name: strategy.name,
              description: strategy.description ?? "",
              timeframe: strategy.timeframe ?? "",
              market: strategy.market ?? "",
              setupRules: strategy.setupRules ?? "",
              entryRules: strategy.entryRules ?? "",
              exitRules: strategy.exitRules ?? "",
              riskRules: strategy.riskRules ?? "",
            }
          : EMPTY
      );
    }
  }, [open, strategy]);

  const set = (key: keyof StrategyInput) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setFields((f) => ({ ...f, [key]: e.target.value }));

  const canSubmit = fields.name.trim().length >= 3;

  const handleSubmit = () => {
    const payload: StrategyInput = {
      name: fields.name.trim(),
      description: fields.description?.trim() || undefined,
      timeframe: fields.timeframe?.trim() || undefined,
      market: fields.market?.trim() || undefined,
      setupRules: fields.setupRules?.trim() || undefined,
      entryRules: fields.entryRules?.trim() || undefined,
      exitRules: fields.exitRules?.trim() || undefined,
      riskRules: fields.riskRules?.trim() || undefined,
    };

    if (isEdit && strategy) {
      updateStrategy.mutate({ id: strategy.id, payload }, { onSuccess: () => onOpenChange(false) });
    } else {
      createStrategy.mutate(payload, { onSuccess: () => onOpenChange(false) });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] max-w-lg overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit strategy" : "New strategy"}</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <Field>
            <FieldLabel htmlFor="strategy-name">Name</FieldLabel>
            <Input id="strategy-name" value={fields.name} onChange={set("name")} />
          </Field>

          <Field>
            <FieldLabel htmlFor="strategy-description">Description</FieldLabel>
            <Textarea id="strategy-description" value={fields.description} onChange={set("description")} />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field>
              <FieldLabel htmlFor="strategy-timeframe">Timeframe</FieldLabel>
              <Input
                id="strategy-timeframe"
                placeholder="e.g. 15m, Daily"
                value={fields.timeframe}
                onChange={set("timeframe")}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="strategy-market">Market</FieldLabel>
              <Input
                id="strategy-market"
                placeholder="e.g. NIFTY options"
                value={fields.market}
                onChange={set("market")}
              />
            </Field>
          </div>

          <Field>
            <FieldLabel htmlFor="strategy-setup">Setup rules</FieldLabel>
            <Textarea id="strategy-setup" value={fields.setupRules} onChange={set("setupRules")} />
          </Field>

          <Field>
            <FieldLabel htmlFor="strategy-entry">Entry rules</FieldLabel>
            <Textarea id="strategy-entry" value={fields.entryRules} onChange={set("entryRules")} />
          </Field>

          <Field>
            <FieldLabel htmlFor="strategy-exit">Exit rules</FieldLabel>
            <Textarea id="strategy-exit" value={fields.exitRules} onChange={set("exitRules")} />
          </Field>

          <Field>
            <FieldLabel htmlFor="strategy-risk">Risk rules</FieldLabel>
            <Textarea id="strategy-risk" value={fields.riskRules} onChange={set("riskRules")} />
          </Field>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button disabled={!canSubmit || isPending} onClick={handleSubmit}>
            {isPending ? "Saving…" : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
