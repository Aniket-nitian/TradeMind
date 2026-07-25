import axios from "axios";
import { useAuthStore } from "@/store/auth-store";
import type { ApiResponse } from "./types";

const API_URL = import.meta.env.VITE_API_URL;

let refreshPromise: Promise<string | null> | null = null;

export function refreshAccessToken(): Promise<string | null> {
  if (!refreshPromise) {
    refreshPromise = axios
      .post<ApiResponse<{ accessToken: string }>>(
        `${API_URL}/auth/refresh`,
        {},
        { withCredentials: true }
      )
      .then((res) => {
        const token = res.data.data.accessToken;
        useAuthStore.getState().setAccessToken(token);
        return token;
      })
      .catch(() => {
        useAuthStore.getState().clearSession();
        return null;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
}
