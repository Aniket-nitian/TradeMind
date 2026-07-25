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
import { cn } from "@/lib/utils";
import type { Tag } from "../types";
import { useCreateTag, useUpdateTag } from "../hooks";

const PRESET_COLORS = [
  "#ef4444",
  "#f97316",
  "#eab308",
  "#22c55e",
  "#14b8a6",
  "#3b82f6",
  "#8b5cf6",
  "#ec4899",
  "#64748b",
];

export function TagDialog({
  tag,
  open,
  onOpenChange,
}: {
  tag: Tag | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [name, setName] = useState("");
  const [color, setColor] = useState("");
  const createTag = useCreateTag();
  const updateTag = useUpdateTag();
  const isEdit = Boolean(tag);
  const isPending = createTag.isPending || updateTag.isPending;

  useEffect(() => {
    if (open) {
      setName(tag?.name ?? "");
      setColor(tag?.color ?? "");
    }
  }, [open, tag]);

  const canSubmit = name.trim().length >= 2;

  const handleSubmit = () => {
    const payload = { name: name.trim(), color: color || undefined };

    if (isEdit && tag) {
      updateTag.mutate({ id: tag.id, payload }, { onSuccess: () => onOpenChange(false) });
    } else {
      createTag.mutate(payload, { onSuccess: () => onOpenChange(false) });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit tag" : "New tag"}</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <Field>
            <FieldLabel htmlFor="tag-name">Name</FieldLabel>
            <Input id="tag-name" value={name} onChange={(e) => setName(e.target.value)} />
          </Field>

          <Field>
            <FieldLabel>Color</FieldLabel>
            <div className="flex flex-wrap items-center gap-2">
              {PRESET_COLORS.map((hex) => (
                <button
                  key={hex}
                  type="button"
                  aria-label={hex}
                  onClick={() => setColor(hex)}
                  className={cn(
                    "size-6 rounded-full ring-offset-2 ring-offset-background transition-shadow",
                    color.toLowerCase() === hex ? "ring-2 ring-ring" : "hover:ring-2 hover:ring-border"
                  )}
                  style={{ backgroundColor: hex }}
                />
              ))}
              <Input
                value={color}
                onChange={(e) => setColor(e.target.value)}
                placeholder="#hex"
                className="w-28"
              />
            </div>
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
