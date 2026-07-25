import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { queryKeys } from "@/lib/api/query-keys";
import { normalizeError } from "@/lib/api/normalize-error";
import { memoryApi } from "./api";

export function useAiMemory() {
  return useQuery({
    queryKey: queryKeys.aiMemory.root,
    queryFn: memoryApi.get,
    retry: false,
  });
}

export function useRefreshAiMemory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: memoryApi.refresh,
    onSuccess: (data) => {
      queryClient.setQueryData(queryKeys.aiMemory.root, data);
      toast.success("Memory refreshed.");
    },
    onError: (error) => toast.error(normalizeError(error)),
  });
}
