import { useState } from "react";
import { MoreHorizontal, Pencil, Plus, Trash2 } from "lucide-react";

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
import { EmptyState } from "@/components/common/EmptyState";
import { TableSkeleton } from "@/components/common/LoadingSkeletons";
import { useStrategyAnalytics } from "@/features/analytics/hooks";
import type { Strategy } from "@/features/trades/types";
import { formatCurrency, pnlClass } from "@/lib/utils";
import { useDeleteStrategy, useStrategies } from "../hooks";
import { StrategyDialog } from "./StrategyDialog";

export function StrategiesTab() {
  const { data: strategies, isLoading } = useStrategies();
  const { data: analytics } = useStrategyAnalytics();
  const deleteStrategy = useDeleteStrategy();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Strategy | null>(null);
  const [pendingDelete, setPendingDelete] = useState<Strategy | null>(null);

  const openCreate = () => {
    setEditing(null);
    setDialogOpen(true);
  };

  const openEdit = (strategy: Strategy) => {
    setEditing(strategy);
    setDialogOpen(true);
  };

  const perfFor = (id: string) => analytics?.find((a) => a.strategyId === id);

  if (isLoading) return <TableSkeleton />;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <Button onClick={openCreate}>
          <Plus className="size-4" />
          New strategy
        </Button>
      </div>

      {!strategies || strategies.length === 0 ? (
        <EmptyState
          title="No strategies yet"
          description="Create a strategy to tag your trades and track its performance over time."
          action={
            <Button onClick={openCreate}>
              <Plus className="size-4" />
              New strategy
            </Button>
          }
        />
      ) : (
        <div className="flex flex-col divide-y divide-border">
          {strategies.map((strategy) => {
            const perf = perfFor(strategy.id);
            return (
              <div key={strategy.id} className="flex items-center justify-between gap-4 py-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-sm font-medium">{strategy.name}</p>
                    {(strategy.timeframe || strategy.market) && (
                      <span className="truncate text-xs text-muted-foreground">
                        {[strategy.timeframe, strategy.market].filter(Boolean).join(" · ")}
                      </span>
                    )}
                  </div>
                  {strategy.description && (
                    <p className="truncate text-xs text-muted-foreground">{strategy.description}</p>
                  )}
                </div>

                <div className="flex shrink-0 items-center gap-3">
                  {perf && perf.trades > 0 && (
                    <div className="hidden items-center gap-3 text-xs text-muted-foreground sm:flex">
                      <span>{perf.trades} trades</span>
                      <span>{perf.winRate.toFixed(0)}% win rate</span>
                      <span className={pnlClass(perf.netPnL)}>{formatCurrency(perf.netPnL)}</span>
                    </div>
                  )}
                  {strategy.isActive === false && <Badge variant="secondary">Inactive</Badge>}

                  <DropdownMenu>
                    <DropdownMenuTrigger render={<Button variant="ghost" size="icon-sm" />}>
                      <MoreHorizontal className="size-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => openEdit(strategy)}>
                        <Pencil className="size-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem variant="destructive" onClick={() => setPendingDelete(strategy)}>
                        <Trash2 className="size-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <StrategyDialog strategy={editing} open={dialogOpen} onOpenChange={setDialogOpen} />

      <Dialog open={!!pendingDelete} onOpenChange={(open) => !open && setPendingDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete strategy</DialogTitle>
            <DialogDescription>
              This will permanently delete &ldquo;{pendingDelete?.name}&rdquo;. Trades already tagged
              with it will keep their history but lose the strategy link. This can&apos;t be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPendingDelete(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              disabled={deleteStrategy.isPending}
              onClick={() => {
                if (!pendingDelete) return;
                deleteStrategy.mutate(pendingDelete.id, {
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
