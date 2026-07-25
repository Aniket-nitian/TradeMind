import { useState } from "react";
import { MoreHorizontal, Pencil, Plus, Trash2 } from "lucide-react";

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
import { EmptyState } from "@/components/common/EmptyState";
import { TableSkeleton } from "@/components/common/LoadingSkeletons";
import { useDeleteMistake, useMistakesCatalog } from "../hooks";
import type { MistakeTagDef } from "../types";
import { MistakeDialog } from "./MistakeDialog";

export function MistakesTab() {
  const { data: mistakes, isLoading } = useMistakesCatalog();
  const deleteMistake = useDeleteMistake();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<MistakeTagDef | null>(null);
  const [pendingDelete, setPendingDelete] = useState<MistakeTagDef | null>(null);

  const openCreate = () => {
    setEditing(null);
    setDialogOpen(true);
  };

  const openEdit = (mistake: MistakeTagDef) => {
    setEditing(mistake);
    setDialogOpen(true);
  };

  if (isLoading) return <TableSkeleton />;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <Button onClick={openCreate}>
          <Plus className="size-4" />
          New mistake
        </Button>
      </div>

      {!mistakes || mistakes.length === 0 ? (
        <EmptyState
          title="No mistakes catalogued yet"
          description="Define recurring mistakes so you can tag them on trades and spot patterns over time."
          action={
            <Button onClick={openCreate}>
              <Plus className="size-4" />
              New mistake
            </Button>
          }
        />
      ) : (
        <div className="flex flex-col divide-y divide-border">
          {mistakes.map((mistake) => (
            <div key={mistake.id} className="flex items-center justify-between gap-4 py-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{mistake.name}</p>
                {mistake.description && (
                  <p className="truncate text-xs text-muted-foreground">{mistake.description}</p>
                )}
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger render={<Button variant="ghost" size="icon-sm" />}>
                  <MoreHorizontal className="size-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => openEdit(mistake)}>
                    <Pencil className="size-4" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem variant="destructive" onClick={() => setPendingDelete(mistake)}>
                    <Trash2 className="size-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ))}
        </div>
      )}

      <MistakeDialog mistake={editing} open={dialogOpen} onOpenChange={setDialogOpen} />

      <Dialog open={!!pendingDelete} onOpenChange={(open) => !open && setPendingDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete mistake</DialogTitle>
            <DialogDescription>
              This will permanently delete &ldquo;{pendingDelete?.name}&rdquo; and remove it from any
              trades it&apos;s attached to. This can&apos;t be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPendingDelete(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              disabled={deleteMistake.isPending}
              onClick={() => {
                if (!pendingDelete) return;
                deleteMistake.mutate(pendingDelete.id, {
                  onSuccess: () => setPendingDelete(null),
                });
              }}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
