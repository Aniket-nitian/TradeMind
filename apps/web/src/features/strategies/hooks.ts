import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/api/query-keys";
import { strategiesApi, type StrategyInput } from "./api";

export function useStrategies() {
  return useQuery({
    queryKey: queryKeys.strategies.list,
    queryFn: strategiesApi.list,
  });
}

function useInvalidateStrategies() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: queryKeys.strategies.list });
}

export function useCreateStrategy() {
  const invalidate = useInvalidateStrategies();
  return useMutation({
    mutationFn: (payload: StrategyInput) => strategiesApi.create(payload),
    onSuccess: invalidate,
  });
}

export function useUpdateStrategy() {
  const invalidate = useInvalidateStrategies();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<StrategyInput> }) =>
      strategiesApi.update(id, payload),
    onSuccess: invalidate,
  });
}

export function useDeleteStrategy() {
  const invalidate = useInvalidateStrategies();
  return useMutation({
    mutationFn: (id: string) => strategiesApi.remove(id),
    onSuccess: invalidate,
  });
}
