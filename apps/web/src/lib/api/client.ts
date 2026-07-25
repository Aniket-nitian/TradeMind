import axios, {
  type AxiosError,
  type InternalAxiosRequestConfig,
} from "axios";
import { useAuthStore } from "@/store/auth-store";
import { refreshAccessToken } from "./refresh";

declare module "axios" {
  export interface InternalAxiosRequestConfig {
    _retry?: boolean;
  }
}

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

function attachAuth(config: InternalAxiosRequestConfig) {
  const token = useAuthStore.getState().accessToken;

  if (token) {
    config.headers.set("Authorization", `Bearer ${token}`);
  }

  return config;
}

apiClient.interceptors.request.use(attachAuth);

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const config = error.config;

    const isAuthEndpoint =
      config?.url?.includes("/auth/login") ||
      config?.url?.includes("/auth/refresh");

    if (
      error.response?.status === 401 &&
      config &&
      !config._retry &&
      !isAuthEndpoint
    ) {
      config._retry = true;

      const newToken = await refreshAccessToken();

      if (newToken) {
        config.headers.set("Authorization", `Bearer ${newToken}`);
        return apiClient(config);
      }
    }

    return Promise.reject(error);
  }
);
