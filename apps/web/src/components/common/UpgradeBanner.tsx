import { Crown } from "lucide-react";
import { normalizeError } from "@/lib/api/normalize-error";

export function UpgradeBanner({ error }: { error: unknown }) {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-primary/30 bg-primary/5 p-4">
      <Crown className="mt-0.5 size-5 shrink-0 text-primary" />
      <div>
        <p className="font-medium">Premium feature</p>
        <p className="text-sm text-muted-foreground">
          {normalizeError(error)}
        </p>
      </div>
    </div>
  );
}
