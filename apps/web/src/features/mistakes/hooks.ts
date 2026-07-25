import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/api/query-keys";
import { mistakesApi, type MistakeInput } from "./api";

export function useMistakesCatalog() {
  return useQuery({
    queryKey: queryKeys.mistakesCatalog.list,
    queryFn: mistakesApi.list,
  });
}

function useInvalidateMistakesCatalog() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: queryKeys.mistakesCatalog.list });
}

export function useCreateMistake() {
  const invalidate = useInvalidateMistakesCatalog();
  return useMutation({
    mutationFn: (payload: MistakeInput) => mistakesApi.create(payload),
    onSuccess: invalidate,
  });
}

export function useUpdateMistake() {
  const invalidate = useInvalidateMistakesCatalog();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<MistakeInput> }) =>
      mistakesApi.update(id, payload),
    onSuccess: invalidate,
  });
}

export function useDeleteMistake() {
  const invalidate = useInvalidateMistakesCatalog();
  return useMutation({
    mutationFn: (id: string) => mistakesApi.remove(id),
    onSuccess: invalidate,
  });
}

export function useAttachMistakes() {
  return useMutation({
    mutationFn: async ({
      tradeId,
      mistakeIds,
    }: {
      tradeId: string;
      mistakeIds: string[];
    }) => {
      await Promise.all(
        mistakeIds.map((mistakeId) =>
          mistakesApi.attachToTrade(tradeId, mistakeId)
        )
      );
    },
  });
}
