import { Laptop, ShieldOff, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useLogoutAll } from "@/features/auth/hooks";
import { formatDateTime } from "@/lib/utils";
import { useRevokeSession, useSessions } from "../hooks";

export function SessionsSection() {
  const { data: sessions, isLoading } = useSessions();
  const revoke = useRevokeSession();
  const logoutAll = useLogoutAll();

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle>Active sessions</CardTitle>
        <Button
          variant="outline"
          size="sm"
          className="text-destructive"
          disabled={logoutAll.isPending}
          onClick={() => logoutAll.mutate()}
        >
          <ShieldOff className="size-4" />
          Log out of all devices
        </Button>
      </CardHeader>
      <CardContent className="flex flex-col divide-y divide-border">
        {isLoading && <Skeleton className="h-20 w-full rounded-lg" />}

        {sessions?.length === 0 && (
          <p className="text-sm text-muted-foreground">No active sessions.</p>
        )}

        {sessions?.map((s) => (
          <div key={s.id} className="flex items-center justify-between py-3">
            <div className="flex items-center gap-3">
              <Laptop className="size-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">
                  {s.deviceName ?? s.browser ?? "Unknown device"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {s.ipAddress ?? "—"} · last active {formatDateTime(s.lastActiveAt)}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon-sm"
              disabled={revoke.isPending}
              onClick={() => revoke.mutate(s.id)}
            >
              <Trash2 className="size-4" />
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
