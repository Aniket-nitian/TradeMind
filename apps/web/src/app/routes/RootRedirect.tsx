import { Navigate } from "react-router-dom";

import { useAuthStore } from "@/store/auth-store";
import { useAuthBootstrap } from "@/features/auth/hooks";

export function RootRedirect() {
  useAuthBootstrap();

  const status = useAuthStore((s) => s.status);

  if (status === "idle" || status === "authenticating") {
    return (
      <div className="flex min-h-screen items-center justify-center text-muted-foreground">
        Loading…
      </div>
    );
  }

  if (status === "authenticated") {
    return <Navigate to="/dashboard" replace />;
  }

  return <Navigate to="/demo/dashboard" replace />;
}
