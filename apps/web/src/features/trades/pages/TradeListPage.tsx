import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Upload } from "lucide-react";

import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/common/EmptyState";
import { ErrorState } from "@/components/common/ErrorState";
import { PageHeader } from "@/components/common/PageHeader";
import { TableSkeleton } from "@/components/common/LoadingSkeletons";
import { useDemoGate } from "@/features/demo/DemoModeContext";
import { useTrades } from "../hooks";
import { TradeTable } from "../components/TradeTable";
import { TradeFilterBar, MANUAL_SOURCE, type TradeFilters } from "../components/TradeFilterBar";
import { JournalStatsRow } from "../components/JournalStatsRow";
import { exportTradesToCsv } from "../lib/export-csv";

const LIMIT = 20;

export default function TradeListPage() {
  const navigate = useNavigate();
  const { requireAuth } = useDemoGate();
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<TradeFilters>({});

  const { data, isLoading, error } = useTrades({ page, limit: LIMIT });

  const filteredTrades = useMemo(() => {
    if (!data) return [];
    return data.trades.filter((trade) => {
      if (filters.strategyId && trade.strategyId !== filters.strategyId) return false;
      if (filters.emotion && trade.emotionBefore !== filters.emotion) return false;
      if (filters.from && trade.entryTime < filters.from) return false;
      if (filters.to && trade.entryTime > `${filters.to}T23:59:59`) return false;
      if (filters.broker) {
        if (filters.broker === MANUAL_SOURCE) {
          if (trade.broker !== null) return false;
        } else if (trade.broker !== filters.broker) {
          return false;
        }
      }
      return true;
    });
  }, [data, filters]);

  return (
    <div>
      <PageHeader
        title="Journal"
        description="Your full trading journal."
        actions={
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => requireAuth() && navigate("/import")}>
              <Upload className="size-4" />
              Import trades
            </Button>
            <Button onClick={() => requireAuth() && navigate("/trades/new")}>
              <Plus className="size-4" />
              New trade
            </Button>
          </div>
        }
      />

      {isLoading && <TableSkeleton />}

      {error && <ErrorState error={error} />}

      {data && data.trades.length === 0 && (
        <EmptyState
          title="No trades yet"
          description="Log your first trade to start building your journal."
          action={
            <Button onClick={() => requireAuth() && navigate("/trades/new")}>
              <Plus className="size-4" />
              New trade
            </Button>
          }
        />
      )}

      {data && data.trades.length > 0 && (
        <>
          <JournalStatsRow trades={filteredTrades} />

          <TradeFilterBar
            filters={filters}
            onChange={setFilters}
            onExport={() => exportTradesToCsv(filteredTrades)}
          />

          {filteredTrades.length === 0 ? (
            <EmptyState
              title="No trades match these filters"
              description="Try adjusting or clearing the filters above. Filters only apply to the currently loaded page."
            />
          ) : (
            <TradeTable trades={filteredTrades} />
          )}

          <div className="mt-4 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Page {data.pagination.page} of {data.pagination.totalPages} (
              {data.pagination.total} trades)
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={!data.pagination.hasPrevious}
                onClick={() => requireAuth() && setPage((p) => Math.max(1, p - 1))}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={!data.pagination.hasNext}
                onClick={() => requireAuth() && setPage((p) => p + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
