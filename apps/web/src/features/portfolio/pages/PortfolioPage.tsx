import { useState } from "react";
import { Camera } from "lucide-react";

import { EmptyState } from "@/components/common/EmptyState";
import { PageHeader } from "@/components/common/PageHeader";
import { CardGridSkeleton, TableSkeleton } from "@/components/common/LoadingSkeletons";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AddCapitalDialog } from "../components/AddCapitalDialog";
import { AllocationBars } from "../components/AllocationBars";
import { CapitalLedgerTable } from "../components/CapitalLedgerTable";
import { HoldingsTable } from "../components/HoldingsTable";
import { PortfolioSummary } from "../components/PortfolioSummary";
import { SnapshotHistoryTable } from "../components/SnapshotHistoryTable";
import {
  useCapitalHistory,
  useCreateSnapshot,
  useHoldings,
  usePortfolioAnalytics,
  usePortfolioValue,
  useSnapshotHistory,
} from "../hooks";

const PAGE_LIMIT = 20;

export default function PortfolioPage() {
  const { data: value, isLoading: valueLoading } = usePortfolioValue();
  const { data: holdings, isLoading: holdingsLoading } = useHoldings();
  const { data: analytics, isLoading: analyticsLoading } = usePortfolioAnalytics();

  const [capitalPage, setCapitalPage] = useState(1);
  const { data: capitalHistory, isLoading: capitalLoading } = useCapitalHistory({
    page: capitalPage,
    limit: PAGE_LIMIT,
  });

  const [snapshotPage, setSnapshotPage] = useState(1);
  const { data: snapshotHistory, isLoading: snapshotLoading } = useSnapshotHistory({
    page: snapshotPage,
    limit: PAGE_LIMIT,
  });

  const createSnapshot = useCreateSnapshot();

  if (
    !valueLoading &&
    value &&
    value.netCapital === 0 &&
    (!holdings || holdings.length === 0)
  ) {
    return (
      <div>
        <PageHeader title="Portfolio" description="Capital, holdings, and portfolio value." />
        <EmptyState
          title="No portfolio data yet"
          description="Record a capital transaction or open a trade to see your portfolio here."
        />
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Portfolio" description="Capital, holdings, and portfolio value." />

      {valueLoading ? <CardGridSkeleton count={5} /> : value && <PortfolioSummary value={value} />}

      <Tabs defaultValue="overview" className="mt-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="holdings">Holdings</TabsTrigger>
          <TabsTrigger value="capital">Capital</TabsTrigger>
          <TabsTrigger value="snapshots">Snapshots</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-4">
          {analyticsLoading ? (
            <CardGridSkeleton count={2} />
          ) : analytics ? (
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>By segment</CardTitle>
                </CardHeader>
                <CardContent>
                  <AllocationBars
                    items={analytics.allocation.bySegment.map((s) => ({
                      label: s.segment,
                      value: s.investedValue,
                    }))}
                    emptyMessage="No open positions yet."
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>By strategy</CardTitle>
                </CardHeader>
                <CardContent>
                  <AllocationBars
                    items={analytics.allocation.byStrategy.map((s) => ({
                      label: s.strategy,
                      value: s.investedValue,
                    }))}
                    emptyMessage="No open positions yet."
                  />
                </CardContent>
              </Card>

              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>By symbol</CardTitle>
                </CardHeader>
                <CardContent>
                  <AllocationBars
                    items={analytics.allocation.bySymbol.map((s) => ({
                      label: s.symbol,
                      value: s.investedValue,
                    }))}
                    emptyMessage="No open positions yet."
                  />
                </CardContent>
              </Card>
            </div>
          ) : null}
        </TabsContent>

        <TabsContent value="holdings" className="mt-4">
          <Card>
            <CardContent className="pt-4">
              {holdingsLoading ? <TableSkeleton /> : <HoldingsTable holdings={holdings ?? []} />}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="capital" className="mt-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Capital ledger</CardTitle>
              <AddCapitalDialog />
            </CardHeader>
            <CardContent>
              {capitalLoading ? (
                <TableSkeleton />
              ) : (
                <>
                  <CapitalLedgerTable transactions={capitalHistory?.transactions ?? []} />
                  {capitalHistory && capitalHistory.pagination.totalPages > 1 && (
                    <div className="mt-4 flex items-center justify-between">
                      <p className="text-sm text-muted-foreground">
                        Page {capitalHistory.pagination.page} of{" "}
                        {capitalHistory.pagination.totalPages}
                      </p>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={!capitalHistory.pagination.hasPrevious}
                          onClick={() => setCapitalPage((p) => Math.max(1, p - 1))}
                        >
                          Previous
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={!capitalHistory.pagination.hasNext}
                          onClick={() => setCapitalPage((p) => p + 1)}
                        >
                          Next
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="snapshots" className="mt-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Snapshot history</CardTitle>
              <Button
                variant="outline"
                disabled={createSnapshot.isPending}
                onClick={() => createSnapshot.mutate()}
              >
                <Camera className="size-4" />
                {createSnapshot.isPending ? "Saving…" : "Take snapshot"}
              </Button>
            </CardHeader>
            <CardContent>
              {snapshotLoading ? (
                <TableSkeleton />
              ) : (
                <>
                  <SnapshotHistoryTable snapshots={snapshotHistory?.snapshots ?? []} />
                  {snapshotHistory && snapshotHistory.pagination.totalPages > 1 && (
                    <div className="mt-4 flex items-center justify-between">
                      <p className="text-sm text-muted-foreground">
                        Page {snapshotHistory.pagination.page} of{" "}
                        {snapshotHistory.pagination.totalPages}
                      </p>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={!snapshotHistory.pagination.hasPrevious}
                          onClick={() => setSnapshotPage((p) => Math.max(1, p - 1))}
                        >
                          Previous
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={!snapshotHistory.pagination.hasNext}
                          onClick={() => setSnapshotPage((p) => p + 1)}
                        >
                          Next
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
