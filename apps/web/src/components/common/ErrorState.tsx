import { AlertTriangle } from "lucide-react";
import { normalizeError } from "@/lib/api/normalize-error";

export function ErrorState({ error }: { error: unknown }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-destructive/30 bg-destructive/5 py-16 text-center text-destructive">
      <AlertTriangle className="size-6" />
      <p className="text-sm font-medium">{normalizeError(error)}</p>
    </div>
  );
}
