import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { useUpdateNotificationPreferences } from "../hooks";
import type { UserProfile } from "../types";

export function NotificationsSection({ profile }: { profile: UserProfile }) {
  const update = useUpdateNotificationPreferences();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Alerts &amp; notifications</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col divide-y divide-border">
        <div className="flex items-center justify-between py-3">
          <div>
            <p className="font-medium">Email reports</p>
            <p className="text-sm text-muted-foreground">Daily and weekly performance summaries.</p>
          </div>
          <Switch
            checked={profile.emailNotificationsEnabled}
            onCheckedChange={(checked) =>
              update.mutate({ emailNotificationsEnabled: checked })
            }
          />
        </div>

        <div className="flex items-center justify-between py-3">
          <div className="flex items-center gap-2">
            <div>
              <p className="font-medium">WhatsApp alerts</p>
              <p className="text-sm text-muted-foreground">
                Instant trade execution alerts.
              </p>
            </div>
            <Badge variant="secondary">Coming soon</Badge>
          </div>
          <Switch
            checked={profile.whatsappNotificationsEnabled}
            onCheckedChange={(checked) =>
              update.mutate({ whatsappNotificationsEnabled: checked })
            }
          />
        </div>
      </CardContent>
    </Card>
  );
}
