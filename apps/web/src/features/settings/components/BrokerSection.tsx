import { useEffect, useState } from "react";
import { Link2, RefreshCw, Unlink } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { formatDateTime } from "@/lib/utils";
import {
  useBrokerAccounts,
  useConnectBroker,
  useDisconnectBroker,
  useSyncBroker,
} from "@/features/broker/hooks";
import { BROKER_LABELS, REGISTERED_BROKERS, type Broker } from "@/features/broker/types";
import { useUpdateBrokerPreferences } from "../hooks";
import type { UserProfile } from "../types";

const ALL_BROKERS: Broker[] = ["DHAN", "ZERODHA", "ANGEL_ONE", "UPSTOX", "GROWW", "FYERS", "ICICI_DIRECT"];

type GrowwMethod = "apiSecret" | "totp";

export function BrokerSection({ profile }: { profile: UserProfile }) {
  const { data: accounts } = useBrokerAccounts();
  const connect = useConnectBroker();
  const disconnect = useDisconnectBroker();
  const sync = useSyncBroker();
  const updateBrokerPreferences = useUpdateBrokerPreferences();

  const [lookbackDays, setLookbackDays] = useState(
    String(profile.brokerSyncLookbackDays ?? 30)
  );

  useEffect(() => {
    setLookbackDays(String(profile.brokerSyncLookbackDays ?? 30));
  }, [profile.brokerSyncLookbackDays]);

  const [connectingBroker, setConnectingBroker] = useState<Broker | null>(null);

  const [accessToken, setAccessToken] = useState("");
  const [dhanClientId, setDhanClientId] = useState("");

  const [growwMethod, setGrowwMethod] = useState<GrowwMethod>("apiSecret");
  const [apiKey, setApiKey] = useState("");
  const [apiSecret, setApiSecret] = useState("");
  const [totpSecret, setTotpSecret] = useState("");

  const accountFor = (broker: Broker) => accounts?.find((a) => a.broker === broker);

  const resetFields = () => {
    setAccessToken("");
    setDhanClientId("");
    setApiKey("");
    setApiSecret("");
    setTotpSecret("");
    setGrowwMethod("apiSecret");
  };

  const closeDialog = () => {
    setConnectingBroker(null);
    resetFields();
  };

  const canSubmit =
    connectingBroker === "DHAN"
      ? Boolean(accessToken)
      : connectingBroker === "GROWW"
        ? Boolean(apiKey) && (growwMethod === "apiSecret" ? Boolean(apiSecret) : Boolean(totpSecret))
        : false;

  const handleConnect = () => {
    if (!connectingBroker) return;

    const payload =
      connectingBroker === "DHAN"
        ? { broker: connectingBroker, accessToken, dhanClientId: dhanClientId || undefined }
        : {
            broker: connectingBroker,
            apiKey,
            apiSecret: growwMethod === "apiSecret" ? apiSecret : undefined,
            totpSecret: growwMethod === "totp" ? totpSecret : undefined,
          };

    connect.mutate(payload, { onSuccess: closeDialog });
  };

  return (
    <Card id="broker">
      <CardHeader>
        <CardTitle>Broker integration</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <Field>
          <FieldLabel htmlFor="lookbackDays">Sync lookback (days)</FieldLabel>
          <div className="flex items-center gap-2">
            <Input
              id="lookbackDays"
              type="number"
              min={1}
              max={1095}
              className="max-w-[140px]"
              value={lookbackDays}
              onChange={(e) => setLookbackDays(e.target.value)}
            />
            <Button
              size="sm"
              variant="outline"
              disabled={updateBrokerPreferences.isPending}
              onClick={() =>
                updateBrokerPreferences.mutate({
                  brokerSyncLookbackDays: Number(lookbackDays),
                })
              }
            >
              Save
            </Button>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            How far back a sync searches for trades (up to 1095 days / 3 years). Widening this
            after a sync has already run will pull in older trades on the next sync.
          </p>
        </Field>

        <div className="flex flex-col divide-y divide-border">
        {ALL_BROKERS.map((broker) => {
          const account = accountFor(broker);
          const isSupported = REGISTERED_BROKERS.includes(broker);

          return (
            <div key={broker} className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                <div className="flex size-8 items-center justify-center rounded-lg bg-accent">
                  <Link2 className="size-4" />
                </div>
                <div>
                  <p className="text-sm font-medium">{BROKER_LABELS[broker]}</p>
                  {account?.isConnected ? (
                    <p className="text-xs text-success">
                      Connected
                      {account.lastSyncedAt &&
                        ` · last synced ${formatDateTime(account.lastSyncedAt)}`}
                    </p>
                  ) : (
                    <p className="text-xs text-muted-foreground">
                      {isSupported ? "Not connected" : "Coming soon"}
                    </p>
                  )}
                </div>
              </div>

              {account?.isConnected ? (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={sync.isPending}
                    onClick={() => sync.mutate(broker)}
                  >
                    <RefreshCw className="size-3.5" />
                    Sync
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => disconnect.mutate(broker)}
                  >
                    <Unlink className="size-4" />
                  </Button>
                </div>
              ) : isSupported ? (
                <Button size="sm" onClick={() => setConnectingBroker(broker)}>
                  Connect
                </Button>
              ) : (
                <Badge variant="secondary">Coming soon</Badge>
              )}
            </div>
          );
        })}
        </div>
      </CardContent>

      <Dialog open={connectingBroker !== null} onOpenChange={(open) => !open && closeDialog()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Connect {connectingBroker ? BROKER_LABELS[connectingBroker] : ""}
            </DialogTitle>
          </DialogHeader>

          {connectingBroker === "DHAN" && (
            <div className="flex flex-col gap-4">
              <Field>
                <FieldLabel htmlFor="dhanClientId">Client ID</FieldLabel>
                <Input
                  id="dhanClientId"
                  value={dhanClientId}
                  onChange={(e) => setDhanClientId(e.target.value)}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="accessToken">Access token</FieldLabel>
                <Input
                  id="accessToken"
                  type="password"
                  value={accessToken}
                  onChange={(e) => setAccessToken(e.target.value)}
                />
              </Field>
            </div>
          )}

          {connectingBroker === "GROWW" && (
            <div className="flex flex-col gap-4">
              <Field>
                <FieldLabel htmlFor="growwApiKey">API key</FieldLabel>
                <Input id="growwApiKey" value={apiKey} onChange={(e) => setApiKey(e.target.value)} />
              </Field>

              <div className="flex gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant={growwMethod === "apiSecret" ? "default" : "outline"}
                  onClick={() => setGrowwMethod("apiSecret")}
                >
                  API secret
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant={growwMethod === "totp" ? "default" : "outline"}
                  onClick={() => setGrowwMethod("totp")}
                >
                  TOTP secret
                </Button>
              </div>

              {growwMethod === "apiSecret" ? (
                <Field>
                  <FieldLabel htmlFor="growwApiSecret">API secret</FieldLabel>
                  <Input
                    id="growwApiSecret"
                    type="password"
                    value={apiSecret}
                    onChange={(e) => setApiSecret(e.target.value)}
                  />
                  <p className="mt-1 text-xs text-muted-foreground">
                    Groww requires re-approving this connection once a day on their own
                    dashboard for automatic sync to keep working. Use TOTP instead if you'd
                    rather avoid that.
                  </p>
                </Field>
              ) : (
                <Field>
                  <FieldLabel htmlFor="growwTotpSecret">TOTP secret</FieldLabel>
                  <Input
                    id="growwTotpSecret"
                    type="password"
                    value={totpSecret}
                    onChange={(e) => setTotpSecret(e.target.value)}
                  />
                  <p className="mt-1 text-xs text-muted-foreground">
                    The base32 secret shown when setting up an authenticator app for your
                    Groww API key — not a 6-digit code, the underlying seed.
                  </p>
                </Field>
              )}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={closeDialog}>
              Cancel
            </Button>
            <Button disabled={!canSubmit || connect.isPending} onClick={handleConnect}>
              {connect.isPending ? "Connecting…" : "Connect"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
