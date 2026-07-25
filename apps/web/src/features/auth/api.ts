import { apiClient } from "@/lib/api/client";
import type { ApiResponse } from "@/lib/api/types";
import type { AuthUser } from "@/store/auth-store";

export interface RegisterInput {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

interface LoginResult {
  user: AuthUser;
  accessToken: string;
}

export interface UserProfile extends AuthUser {
  username: string | null;
  avatarUrl: string | null;
}

export const authApi = {
  register: (payload: RegisterInput) =>
    apiClient
      .post<ApiResponse<AuthUser>>("/auth/register", payload)
      .then((res) => res.data.data),

  login: (payload: LoginInput) =>
    apiClient
      .post<ApiResponse<LoginResult>>("/auth/login", payload)
      .then((res) => res.data.data),

  google: (idToken: string) =>
    apiClient
      .post<ApiResponse<LoginResult>>("/auth/google", { idToken })
      .then((res) => res.data.data),

  logout: () => apiClient.post("/auth/logout"),

  getProfile: () =>
    apiClient
      .get<ApiResponse<UserProfile>>("/users/profile")
      .then((res) => res.data.data),
};
