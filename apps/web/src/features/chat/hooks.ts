import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { normalizeError } from "@/lib/api/normalize-error";
import { chatApi } from "./api";

export function useSendMessage() {
  return useMutation({
    mutationFn: ({
      message,
      conversationId,
    }: {
      message: string;
      conversationId?: string | null;
    }) => chatApi.sendMessage(message, conversationId),
    onError: (error) => toast.error(normalizeError(error)),
  });
}
