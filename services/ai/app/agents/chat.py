from app.services.ai_conversation_service import AiConversationService
from app.services.rag_service import rag_service
from app.agents.memory import memory_agent

from app.tools.dashboard.get_overview import get_dashboard_overview
from app.tools.trade.get_recent_trades import get_recent_trades
from app.tools.strategy.list_strategies import list_strategies

from app.providers.provider_factory import ProviderFactory

from app.prompts.chat import CHAT_SYSTEM_PROMPT

class ChatAgent:

    def __init__(self):

        self.conversations = AiConversationService()

    async def run(
        self,
        token: str,
        conversation_id: str | None,
        message: str,
    ):

        is_new_conversation = conversation_id is None

        if is_new_conversation:
            created = await self.conversations.create_conversation(token)
            conversation_id = created["data"]["id"]
            history = []
        else:
            existing = await self.conversations.get_conversation(
                token,
                conversation_id,
            )
            history = existing["data"]["messages"]

        await self.conversations.add_message(
            token,
            conversation_id,
            "user",
            message,
        )

        overview = await get_dashboard_overview(token)

        recent_trades = await get_recent_trades(token)

        strategies = await list_strategies(token)

        await rag_service.embed_pending_trades(token)

        relevant_trades = await rag_service.retrieve_relevant_trades(
            token,
            message,
            top_k=3,
        )

        if is_new_conversation:
            memory_summary = await memory_agent.refresh(token)
        else:
            memory_summary = await memory_agent.get_summary(token)

        transcript = "\n".join(
            f"{entry['role']}: {entry['content']}"
            for entry in history
        )

        provider = ProviderFactory.get_provider()

        prompt = f"""
What You Know About This Trader (long-term memory, carried across sessions)

{memory_summary if memory_summary else "(no long-term memory yet)"}

Dashboard Overview

{overview}

Recent Trades

{recent_trades.get('trades', [])}

Trader's Saved Strategies
(use this if the trader asks about strategy performance, comparisons,
or which strategy to use — never invent strategies not listed here)

{strategies}

Semantically Relevant Past Journal Entries
(retrieved by matching the trader's new message against past trade
reasoning/notes — may or may not overlap with "Recent Trades" above)

{relevant_trades}

Conversation So Far

{transcript if transcript else "(new conversation)"}

Trader's New Message

{message}
"""

        reply = await provider.generate(
            prompt=prompt,
            system_prompt=CHAT_SYSTEM_PROMPT,
        )

        await self.conversations.add_message(
            token,
            conversation_id,
            "assistant",
            reply,
        )

        return {
            "conversationId": conversation_id,
            "reply": reply,
        }

chat_agent = ChatAgent()
