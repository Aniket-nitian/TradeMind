import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { queryKeys } from "@/lib/api/query-keys";
import { normalizeError } from "@/lib/api/normalize-error";
import { csvImportApi } from "./api";

export function useCsvUpload() {
  return useMutation({
    mutationFn: ({ file, broker }: { file: File; broker?: string }) =>
      csvImportApi.upload(file, broker),
    onError: (error) => toast.error(normalizeError(error)),
  });
}

export function useCsvConfirm() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (importId: string) => csvImportApi.confirm(importId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.trades.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.overview });
      queryClient.invalidateQueries({ queryKey: queryKeys.csvImport.history });
    },
    onError: (error) => toast.error(normalizeError(error)),
  });
}

export function useCsvImportHistory() {
  return useQuery({
    queryKey: queryKeys.csvImport.history,
    queryFn: () => csvImportApi.history({ limit: 10 }),
  });
}
