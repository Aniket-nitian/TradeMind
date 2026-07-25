import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/store/auth-store";
import { useAuthBootstrap } from "@/features/auth/hooks";

export function PublicOnlyRoute() {
  useAuthBootstrap();

  const status = useAuthStore((s) => s.status);

  if (status === "authenticated") {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
