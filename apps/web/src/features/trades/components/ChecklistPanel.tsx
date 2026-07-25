import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useAddChecklistItem,
  useChecklist,
  useDeleteChecklistItem,
  useUpdateChecklistItem,
} from "../hooks";

export function ChecklistPanel({ tradeId }: { tradeId: string }) {
  const { data: checklist, isLoading } = useChecklist(tradeId);
  const addItem = useAddChecklistItem(tradeId);
  const updateItem = useUpdateChecklistItem(tradeId);
  const deleteItem = useDeleteChecklistItem(tradeId);

  const [title, setTitle] = useState("");

  if (isLoading) {
    return <Skeleton className="h-40 w-full rounded-lg" />;
  }

  return (
    <div className="flex flex-col gap-3">
      {checklist?.map((item) => (
        <div key={item.id} className="flex items-center gap-2">
          <Checkbox
            checked={item.isChecked}
            onCheckedChange={(checked) =>
              updateItem.mutate({
                checklistId: item.id,
                isChecked: checked === true,
              })
            }
          />
          <span
            className={
              item.isChecked ? "flex-1 text-muted-foreground line-through" : "flex-1"
            }
          >
            {item.title}
          </span>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => deleteItem.mutate(item.id)}
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      ))}

      {checklist?.length === 0 && (
        <p className="text-sm text-muted-foreground">No checklist items yet.</p>
      )}

      <form
        className="flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          if (!title.trim()) return;
          addItem.mutate(title.trim(), { onSuccess: () => setTitle("") });
        }}
      >
        <Input
          placeholder="Add a checklist item…"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <Button type="submit" disabled={addItem.isPending}>
          <Plus className="size-4" />
          Add
        </Button>
      </form>
    </div>
  );
}
