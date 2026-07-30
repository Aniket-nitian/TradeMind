import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/store/auth-store";
import { useAuthBootstrap } from "@/features/auth/hooks";
import { AuthLoadingScreen } from "./AuthLoadingScreen";

export function ProtectedRoute() {
  useAuthBootstrap();

  const status = useAuthStore((s) => s.status);

  if (status === "idle" || status === "authenticating") {
    return <AuthLoadingScreen />;
  }

  if (status === "unauthenticated") {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
