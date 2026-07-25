import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/store/auth-store";
import { useAuthBootstrap } from "@/features/auth/hooks";

export function ProtectedRoute() {
  useAuthBootstrap();

  const status = useAuthStore((s) => s.status);

  if (status === "idle" || status === "authenticating") {
    return (
      <div className="flex min-h-screen items-center justify-center text-muted-foreground">
        Loading…
      </div>
    );
  }

  if (status === "unauthenticated") {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
