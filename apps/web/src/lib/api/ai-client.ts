import axios, {
  type AxiosError,
  type InternalAxiosRequestConfig,
} from "axios";
import { useAuthStore } from "@/store/auth-store";
import { refreshAccessToken } from "./refresh";

export const aiClient = axios.create({
  baseURL: import.meta.env.VITE_AI_URL,
});

function attachAuth(config: InternalAxiosRequestConfig) {
  const token = useAuthStore.getState().accessToken;

  if (token) {
    config.headers.set("Authorization", `Bearer ${token}`);
  }

  return config;
}

aiClient.interceptors.request.use(attachAuth);

aiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const config = error.config;

    if (error.response?.status === 401 && config && !config._retry) {
      config._retry = true;

      const newToken = await refreshAccessToken();

      if (newToken) {
        config.headers.set("Authorization", `Bearer ${newToken}`);
        return aiClient(config);
      }
    }

    return Promise.reject(error);
  }
);
