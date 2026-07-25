import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/api/query-keys";
import { tagsApi, type TagInput } from "./api";

export function useTags() {
  return useQuery({
    queryKey: queryKeys.tags.list,
    queryFn: tagsApi.list,
  });
}

function useInvalidateTags() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: queryKeys.tags.list });
}

export function useCreateTag() {
  const invalidate = useInvalidateTags();
  return useMutation({
    mutationFn: (payload: TagInput) => tagsApi.create(payload),
    onSuccess: invalidate,
  });
}

export function useUpdateTag() {
  const invalidate = useInvalidateTags();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<TagInput> }) =>
      tagsApi.update(id, payload),
    onSuccess: invalidate,
  });
}

export function useDeleteTag() {
  const invalidate = useInvalidateTags();
  return useMutation({
    mutationFn: (id: string) => tagsApi.remove(id),
    onSuccess: invalidate,
  });
}
