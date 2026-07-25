import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useUpdateTradingPreferences } from "../hooks";
import type { UserProfile } from "../types";

export function TradingPreferencesSection({ profile }: { profile: UserProfile }) {
  const update = useUpdateTradingPreferences();
  const [accountSize, setAccountSize] = useState(String(profile.defaultAccountSize ?? ""));
  const [riskPercent, setRiskPercent] = useState(String(profile.defaultRiskPercent ?? ""));

  useEffect(() => {
    setAccountSize(String(profile.defaultAccountSize ?? ""));
    setRiskPercent(String(profile.defaultRiskPercent ?? ""));
  }, [profile]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Trading preferences</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <FieldGroup>
          <div className="grid grid-cols-2 gap-4">
            <Field>
              <FieldLabel htmlFor="accountSize">Default account size (₹)</FieldLabel>
              <Input
                id="accountSize"
                type="number"
                value={accountSize}
                onChange={(e) => setAccountSize(e.target.value)}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="riskPercent">Default risk per trade (%)</FieldLabel>
              <Input
                id="riskPercent"
                type="number"
                value={riskPercent}
                onChange={(e) => setRiskPercent(e.target.value)}
              />
            </Field>
          </div>
        </FieldGroup>
        <div className="flex justify-end">
          <Button
            disabled={update.isPending}
            onClick={() =>
              update.mutate({
                defaultAccountSize: accountSize ? Number(accountSize) : undefined,
                defaultRiskPercent: riskPercent ? Number(riskPercent) : undefined,
              })
            }
          >
            {update.isPending ? "Saving…" : "Save preferences"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
