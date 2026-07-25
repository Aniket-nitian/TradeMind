import { useEffect, useRef, useState } from "react";

import { PageHeader } from "@/components/common/PageHeader";
import { useSendMessage } from "../hooks";
import { MessageBubble, type ChatMessage } from "../components/MessageBubble";
import { ChatComposer } from "../components/ChatComposer";
import { SuggestedPrompts } from "../components/SuggestedPrompts";
import { InsightSidebar } from "../components/InsightSidebar";

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const sendMessage = useSendMessage();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, sendMessage.isPending]);

  const handleSend = (content: string) => {
    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content,
    };

    setMessages((prev) => [...prev, userMessage]);

    sendMessage.mutate(
      { message: content, conversationId },
      {
        onSuccess: (result) => {
          setConversationId(result.conversationId);
          setMessages((prev) => [
            ...prev,
            { id: crypto.randomUUID(), role: "assistant", content: result.reply },
          ]);
        },
      }
    );
  };

  return (
    <div className="flex h-[calc(100vh-6.5rem)] flex-col">
      <PageHeader
        title="AI Chat"
        description="Ask about your trades, patterns, and strategies."
      />

      <div className="grid flex-1 grid-cols-1 gap-4 overflow-hidden lg:grid-cols-[1fr_320px]">
        <div className="flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto rounded-xl border border-border bg-card p-4">
            {messages.length === 0 && (
              <div className="flex flex-col gap-3">
                <p className="text-sm text-muted-foreground">
                  Start a conversation — ask how your trading has been going, or
                  about a specific trade or strategy.
                </p>
                <SuggestedPrompts onSelect={handleSend} />
              </div>
            )}

            <div className="flex flex-col gap-3">
              {messages.map((message) => (
                <MessageBubble key={message.id} message={message} />
              ))}

              {sendMessage.isPending && (
                <MessageBubble
                  message={{ id: "pending", role: "assistant", content: "Thinking…" }}
                />
              )}
            </div>

            <div ref={bottomRef} />
          </div>

          <div className="mt-3">
            <ChatComposer onSend={handleSend} disabled={sendMessage.isPending} />
          </div>
        </div>

        <div className="hidden overflow-y-auto lg:block">
          <InsightSidebar />
        </div>
      </div>
    </div>
  );
}
