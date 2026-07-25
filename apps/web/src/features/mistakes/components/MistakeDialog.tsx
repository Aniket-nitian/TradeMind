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
import type { MistakeTagDef } from "../types";
import { useCreateMistake, useUpdateMistake } from "../hooks";

export function MistakeDialog({
  mistake,
  open,
  onOpenChange,
}: {
  mistake: MistakeTagDef | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const createMistake = useCreateMistake();
  const updateMistake = useUpdateMistake();
  const isEdit = Boolean(mistake);
  const isPending = createMistake.isPending || updateMistake.isPending;

  useEffect(() => {
    if (open) {
      setName(mistake?.name ?? "");
      setDescription(mistake?.description ?? "");
    }
  }, [open, mistake]);

  const canSubmit = name.trim().length >= 2;

  const handleSubmit = () => {
    const payload = { name: name.trim(), description: description.trim() || undefined };

    if (isEdit && mistake) {
      updateMistake.mutate({ id: mistake.id, payload }, { onSuccess: () => onOpenChange(false) });
    } else {
      createMistake.mutate(payload, { onSuccess: () => onOpenChange(false) });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit mistake" : "New mistake"}</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <Field>
            <FieldLabel htmlFor="mistake-name">Name</FieldLabel>
            <Input id="mistake-name" value={name} onChange={(e) => setName(e.target.value)} />
          </Field>

          <Field>
            <FieldLabel htmlFor="mistake-description">Description</FieldLabel>
            <Textarea
              id="mistake-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
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
