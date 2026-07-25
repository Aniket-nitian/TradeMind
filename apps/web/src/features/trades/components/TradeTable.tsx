import { Fragment, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown, ChevronRight, MoreHorizontal, Trash2 } from "lucide-react";

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
import { EmotionBadge } from "@/components/common/EmotionBadge";
import { BrokerBadge } from "@/components/common/BrokerBadge";
import { formatCurrency, formatDate, pnlClass } from "@/lib/utils";
import { useDemoGate } from "@/features/demo/DemoModeContext";
import { useDeleteTrade } from "../hooks";
import { TradeRowExpanded } from "./TradeRowExpanded";
import type { Trade } from "../types";

export function TradeTable({ trades }: { trades: Trade[] }) {
  const navigate = useNavigate();
  const { requireAuth } = useDemoGate();
  const deleteTrade = useDeleteTrade();
  const [pendingDelete, setPendingDelete] = useState<Trade | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-8" />
            <TableHead>Symbol</TableHead>
            <TableHead>Source</TableHead>
            <TableHead>Side</TableHead>
            <TableHead>Emotion</TableHead>
            <TableHead>Entry</TableHead>
            <TableHead>Exit</TableHead>
            <TableHead>Net P&amp;L</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-10" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {trades.map((trade) => {
            const isExpanded = expandedId === trade.id;
            return (
              <Fragment key={trade.id}>
                <TableRow
                  className="cursor-pointer"
                  onClick={() => requireAuth() && navigate(`/trades/${trade.id}`)}
                >
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <button
                      type="button"
                      aria-label={isExpanded ? "Collapse row" : "Expand row"}
                      className="flex size-6 items-center justify-center rounded hover:bg-accent"
                      onClick={() => setExpandedId(isExpanded ? null : trade.id)}
                    >
                      {isExpanded ? (
                        <ChevronDown className="size-4 text-muted-foreground" />
                      ) : (
                        <ChevronRight className="size-4 text-muted-foreground" />
                      )}
                    </button>
                  </TableCell>
                  <TableCell className="font-medium">{trade.symbol}</TableCell>
                  <TableCell>
                    <BrokerBadge broker={trade.broker} />
                  </TableCell>
                  <TableCell>
                    <Badge variant={trade.side === "BUY" ? "default" : "secondary"}>
                      {trade.side}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {trade.emotionBefore ? (
                      <EmotionBadge emotion={trade.emotionBefore} />
                    ) : (
                      <span className="text-sm text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell>{formatDate(trade.entryTime)}</TableCell>
                  <TableCell>{formatDate(trade.exitTime)}</TableCell>
                  <TableCell className={pnlClass(trade.netPnl)}>
                    {formatCurrency(trade.netPnl)}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{trade.status}</Badge>
                  </TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        render={<Button variant="ghost" size="icon-sm" />}
                      >
                        <MoreHorizontal className="size-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => requireAuth() && navigate(`/trades/${trade.id}/edit`)}
                        >
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          variant="destructive"
                          onClick={() => requireAuth() && setPendingDelete(trade)}
                        >
                          <Trash2 className="size-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
                {isExpanded && (
                  <TableRow className="hover:bg-transparent">
                    <TableCell colSpan={10} className="bg-transparent p-3">
                      <TradeRowExpanded tradeId={trade.id} />
                    </TableCell>
                  </TableRow>
                )}
              </Fragment>
            );
          })}
        </TableBody>
      </Table>

      <Dialog
        open={!!pendingDelete}
        onOpenChange={(open) => !open && setPendingDelete(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete trade</DialogTitle>
            <DialogDescription>
              This will permanently delete the {pendingDelete?.symbol} trade.
              This can&apos;t be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPendingDelete(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              disabled={deleteTrade.isPending}
              onClick={() => {
                if (!pendingDelete) return;
                deleteTrade.mutate(pendingDelete.id, {
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
