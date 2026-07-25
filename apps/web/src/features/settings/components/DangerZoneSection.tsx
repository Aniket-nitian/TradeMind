import { useState } from "react";

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
import { useLogout } from "@/features/auth/hooks";
import { useDeactivateAccount } from "../hooks";

export function DangerZoneSection() {
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState("");
  const deactivate = useDeactivateAccount();
  const logout = useLogout();

  return (
    <Card className="ring-destructive/30">
      <CardHeader>
        <CardTitle className="text-destructive">Account privacy</CardTitle>
      </CardHeader>
      <CardContent className="flex items-center justify-between">
        <div>
          <p className="font-medium">Deactivate account</p>
          <p className="text-sm text-muted-foreground">
            Once you deactivate your account, there is no going back. Please be certain.
          </p>
        </div>
        <Button variant="outline" className="text-destructive" onClick={() => setOpen(true)}>
          Deactivate
        </Button>
      </CardContent>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm deactivation</DialogTitle>
          </DialogHeader>
          <Field>
            <FieldLabel htmlFor="confirmPassword">Enter your password to confirm</FieldLabel>
            <Input
              id="confirmPassword"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Field>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              disabled={!password || deactivate.isPending}
              onClick={() =>
                deactivate.mutate(password, {
                  onSuccess: () => {
                    setOpen(false);
                    logout.mutate();
                  },
                })
              }
            >
              {deactivate.isPending ? "Deactivating…" : "Deactivate account"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
