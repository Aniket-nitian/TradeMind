import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TableSkeleton } from "@/components/common/LoadingSkeletons";
import { usePaymentHistory } from "../hooks";
import { PaymentHistoryTable } from "./PaymentHistoryTable";

const PAGE_LIMIT = 10;

export function PaymentHistorySection() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = usePaymentHistory({ page, limit: PAGE_LIMIT });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment history</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <TableSkeleton />
        ) : (
          <>
            <PaymentHistoryTable payments={data?.payments ?? []} />
            {data && data.pagination.totalPages > 1 && (
              <div className="mt-4 flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Page {data.pagination.page} of {data.pagination.totalPages}
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={!data.pagination.hasPrevious}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={!data.pagination.hasNext}
                    onClick={() => setPage((p) => p + 1)}
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
  );
}
