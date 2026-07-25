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
import { useDeleteTag, useTags } from "../hooks";
import type { Tag } from "../types";
import { TagDialog } from "./TagDialog";

export function TagsTab() {
  const { data: tags, isLoading } = useTags();
  const deleteTag = useDeleteTag();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Tag | null>(null);
  const [pendingDelete, setPendingDelete] = useState<Tag | null>(null);

  const openCreate = () => {
    setEditing(null);
    setDialogOpen(true);
  };

  const openEdit = (tag: Tag) => {
    setEditing(tag);
    setDialogOpen(true);
  };

  if (isLoading) return <TableSkeleton />;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <Button onClick={openCreate}>
          <Plus className="size-4" />
          New tag
        </Button>
      </div>

      {!tags || tags.length === 0 ? (
        <EmptyState
          title="No tags yet"
          description="Create tags to label and filter your trades however you like."
          action={
            <Button onClick={openCreate}>
              <Plus className="size-4" />
              New tag
            </Button>
          }
        />
      ) : (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <div
              key={tag.id}
              className="flex items-center gap-2 rounded-full border border-border py-1 pr-1 pl-3"
            >
              <span
                className="size-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: tag.color ?? "var(--muted-foreground)" }}
              />
              <span className="text-sm">{tag.name}</span>
              <DropdownMenu>
                <DropdownMenuTrigger render={<Button variant="ghost" size="icon-sm" />}>
                  <MoreHorizontal className="size-3.5" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => openEdit(tag)}>
                    <Pencil className="size-4" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem variant="destructive" onClick={() => setPendingDelete(tag)}>
                    <Trash2 className="size-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ))}
        </div>
      )}

      <TagDialog tag={editing} open={dialogOpen} onOpenChange={setDialogOpen} />

      <Dialog open={!!pendingDelete} onOpenChange={(open) => !open && setPendingDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete tag</DialogTitle>
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
              disabled={deleteTag.isPending}
              onClick={() => {
                if (!pendingDelete) return;
                deleteTag.mutate(pendingDelete.id, {
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
