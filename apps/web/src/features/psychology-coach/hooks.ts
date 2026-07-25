import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/api/query-keys";
import { psychologyCoachApi } from "./api";

export function usePsychologyCoach() {
  return useQuery({
    queryKey: queryKeys.psychologyCoach.root,
    queryFn: psychologyCoachApi.get,
    staleTime: 5 * 60_000,
    retry: false,
  });
}
