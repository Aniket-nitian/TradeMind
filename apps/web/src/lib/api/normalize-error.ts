import { isAxiosError } from "axios";
import type { ApiErrorBody } from "./types";

export function normalizeError(error: unknown): string {
  if (isAxiosError<ApiErrorBody>(error)) {
    return (
      error.response?.data?.message ?? error.message ?? "Something went wrong."
    );
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong.";
}

export function isPremiumRequired(error: unknown): boolean {
  return isAxiosError(error) && error.response?.status === 403;
}
