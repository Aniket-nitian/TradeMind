import { Navigate } from "react-router-dom";

import { useAuthStore } from "@/store/auth-store";
import { useAuthBootstrap } from "@/features/auth/hooks";
import { AuthLoadingScreen } from "./AuthLoadingScreen";

export function RootRedirect() {
  useAuthBootstrap();

  const status = useAuthStore((s) => s.status);

  if (status === "idle" || status === "authenticating") {
    return <AuthLoadingScreen />;
  }

  if (status === "authenticated") {
    return <Navigate to="/dashboard" replace />;
  }

  return <Navigate to="/demo/dashboard" replace />;
}
