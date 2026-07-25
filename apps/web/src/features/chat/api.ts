import { aiClient } from "@/lib/api/ai-client";

export interface ChatResponse {
  conversationId: string;
  reply: string;
}

export const chatApi = {
  sendMessage: (message: string, conversationId?: string | null) =>
    aiClient
      .post<ChatResponse>("/chat", { message, conversationId })
      .then((res) => res.data),
};
