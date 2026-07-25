from app.services.ai_memory_service import AiMemoryService
from app.providers.provider_factory import ProviderFactory
from app.prompts.memory import MEMORY_SYSTEM_PROMPT


class MemoryAgent:

    def __init__(self):

        self.memory = AiMemoryService()

    async def get_summary(self, token: str) -> str:

        response = await self.memory.get_memory(token)

        return response["data"]["summary"]

    async def refresh(self, token: str) -> str:

        existing = await self.get_summary(token)

        messages_response = await self.memory.get_recent_messages(
            token,
            limit=40,
        )
        messages = messages_response["data"]

        if not messages:
            return existing

        transcript = "\n".join(
            f"{m['role']}: {m['content']}"
            for m in messages
        )

        provider = ProviderFactory.get_provider()

        prompt = f"""
Existing Memory Summary

{existing if existing else "(empty, no memory yet)"}

Recent Conversation Messages

{transcript}
"""

        updated = await provider.generate(
            prompt=prompt,
            system_prompt=MEMORY_SYSTEM_PROMPT,
        )

        updated = updated.strip()

        if updated and updated != existing:
            await self.memory.update_memory(token, updated)

        return updated


memory_agent = MemoryAgent()
