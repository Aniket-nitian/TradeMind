import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { toast } from "sonner";

import { queryKeys } from "@/lib/api/query-keys";
import { normalizeError } from "@/lib/api/normalize-error";
import { refreshAccessToken } from "@/lib/api/refresh";
import { useAuthStore } from "@/store/auth-store";

import { authApi, type LoginInput, type RegisterInput } from "./api";

export function useRegister() {
  return useMutation({
    mutationFn: (payload: RegisterInput) => authApi.register(payload),
    onError: (error) => toast.error(normalizeError(error)),
  });
}

export function useLogin() {
  const setSession = useAuthStore((s) => s.setSession);

  return useMutation({
    mutationFn: (payload: LoginInput) => authApi.login(payload),
    onSuccess: async (result) => {
      setSession(result.user, result.accessToken);

      try {
        const profile = await authApi.getProfile();
        useAuthStore.getState().setUser(profile);
      } catch {
        // Non-fatal — the session is still valid without the extended
        // profile; subscription-aware UI just won't render until a
        // later successful profile fetch.
      }
    },
    onError: (error) => toast.error(normalizeError(error)),
  });
}

export function useGoogleLogin() {
  const setSession = useAuthStore((s) => s.setSession);

  return useMutation({
    mutationFn: (idToken: string) => authApi.google(idToken),
    onSuccess: async (result) => {
      setSession(result.user, result.accessToken);

      try {
        const profile = await authApi.getProfile();
        useAuthStore.getState().setUser(profile);
      } catch {
        // Non-fatal — see useLogin's identical comment above.
      }
    },
    onError: (error) => toast.error(normalizeError(error)),
  });
}

export function useLogout() {
  const clearSession = useAuthStore((s) => s.clearSession);

  return useMutation({
    mutationFn: () => authApi.logout(),
    onSettled: () => clearSession(),
  });
}

export function useProfile() {
  const status = useAuthStore((s) => s.status);

  return useQuery({
    queryKey: queryKeys.auth.profile,
    queryFn: authApi.getProfile,
    enabled: status === "authenticated",
    staleTime: 60_000,
  });
}

export function useAuthBootstrap() {
  const status = useAuthStore((s) => s.status);
  const setUser = useAuthStore((s) => s.setUser);
  const clearSession = useAuthStore((s) => s.clearSession);

  useEffect(() => {
    if (status !== "idle") return;

    let cancelled = false;

    (async () => {
      const token = await refreshAccessToken();

      if (cancelled) return;

      if (!token) {
        clearSession();
        return;
      }

      try {
        const profile = await authApi.getProfile();
        if (!cancelled) {
          useAuthStore.setState({ status: "authenticated" });
          setUser(profile);
        }
      } catch {
        if (!cancelled) clearSession();
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [status]);
}
