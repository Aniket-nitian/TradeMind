import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

const SLOW_HINT_DELAY_MS = 3000;

export function AuthLoadingScreen() {
  const [showSlowHint, setShowSlowHint] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowSlowHint(true), SLOW_HINT_DELAY_MS);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 text-muted-foreground">
      <Loader2 className="size-6 animate-spin" />
      <p className="text-sm">
        {showSlowHint
          ? "Waking up the server — this can take up to a minute on our free hosting tier."
          : "Loading…"}
      </p>
    </div>
  );
}
