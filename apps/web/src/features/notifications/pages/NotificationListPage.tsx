import { useState } from "react";
import { Check, MoreHorizontal, Trash2 } from "lucide-react";

import { PageHeader } from "@/components/common/PageHeader";
import { EmptyState } from "@/components/common/EmptyState";
import { TableSkeleton } from "@/components/common/LoadingSkeletons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatDateTime } from "@/lib/utils";
import {
  useDeleteNotification,
  useMarkAllNotificationsRead,
  useMarkNotificationRead,
  useNotificationsList,
} from "../hooks";
import type { NotificationType } from "../types";

const TYPE_VARIANT: Record<NotificationType, "success" | "warning" | "destructive" | "secondary"> = {
  SUCCESS: "success",
  WARNING: "warning",
  ERROR: "destructive",
  INFO: "secondary",
};

const PAGE_LIMIT = 20;

export default function NotificationListPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useNotificationsList({ page, limit: PAGE_LIMIT });
  const markRead = useMarkNotificationRead();
  const markAllRead = useMarkAllNotificationsRead();
  const deleteNotification = useDeleteNotification();

  const notifications = data?.notifications ?? [];

  return (
    <div>
      <PageHeader
        title="Notifications"
        description="Everything you've been notified about."
        actions={
          data && data.unreadCount > 0 ? (
            <Button variant="outline" onClick={() => markAllRead.mutate()}>
              <Check className="size-4" />
              Mark all read
            </Button>
          ) : undefined
        }
      />

      <Card>
        <CardContent className="pt-4">
          {isLoading ? (
            <TableSkeleton />
          ) : notifications.length === 0 ? (
            <EmptyState title="No notifications yet" description="You're all caught up." />
          ) : (
            <>
              <div className="flex flex-col divide-y divide-border">
                {notifications.map((n) => (
                  <div key={n.id} className="flex items-start justify-between gap-4 py-3">
                    <div className="flex min-w-0 items-start gap-3">
                      {!n.isRead && (
                        <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />
                      )}
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium">{n.title}</p>
                          <Badge variant={TYPE_VARIANT[n.type]}>{n.type}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{n.message}</p>
                        <p className="text-xs text-muted-foreground">{formatDateTime(n.createdAt)}</p>
                      </div>
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger render={<Button variant="ghost" size="icon-sm" />}>
                        <MoreHorizontal className="size-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {!n.isRead && (
                          <DropdownMenuItem onClick={() => markRead.mutate(n.id)}>
                            <Check className="size-4" />
                            Mark read
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem
                          variant="destructive"
                          onClick={() => deleteNotification.mutate(n.id)}
                        >
                          <Trash2 className="size-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                ))}
              </div>

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
    </div>
  );
}
