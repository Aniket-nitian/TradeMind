import { RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAiMemory, useRefreshAiMemory } from "../hooks";

export function MemorySection() {
  const { data, isLoading } = useAiMemory();
  const refresh = useRefreshAiMemory();

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>AI memory</CardTitle>
        <Button
          variant="outline"
          size="sm"
          disabled={refresh.isPending}
          onClick={() => refresh.mutate()}
        >
          <RefreshCw className="size-3.5" />
          {refresh.isPending ? "Refreshing…" : "Refresh"}
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-16 w-full rounded-lg" />
        ) : (
          <p className="text-sm text-muted-foreground">
            {data?.summary || "No memory recorded yet. Chat with the AI assistant to build one up."}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
