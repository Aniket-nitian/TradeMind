import { create } from "zustand";

export interface AuthUser {
  id: string;
  firstName: string;
  lastName?: string | null;
  email: string;
  subscription?: "FREE" | "PREMIUM";
}

export type AuthStatus =
  | "idle"
  | "authenticating"
  | "authenticated"
  | "unauthenticated";

interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  status: AuthStatus;
  setSession: (user: AuthUser, accessToken: string) => void;
  setAccessToken: (accessToken: string) => void;
  setUser: (user: AuthUser) => void;
  clearSession: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  status: "idle",
  setSession: (user, accessToken) =>
    set({ user, accessToken, status: "authenticated" }),
  setAccessToken: (accessToken) => set({ accessToken }),
  setUser: (user) => set({ user }),
  clearSession: () =>
    set({ user: null, accessToken: null, status: "unauthenticated" }),
}));
