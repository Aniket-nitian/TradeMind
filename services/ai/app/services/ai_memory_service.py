from app.services.api_client import APIClient


class AiMemoryService:

    def __init__(self):

        self.client = APIClient()

    async def get_memory(self, token: str):

        return await self.client.get(
            "/api/v1/ai/memory",
            token,
        )

    async def update_memory(self, token: str, summary: str):

        return await self.client.put(
            "/api/v1/ai/memory",
            {"summary": summary},
            token,
        )

    async def get_recent_messages(self, token: str, limit: int = 40):

        return await self.client.get(
            "/api/v1/ai/messages/recent",
            token,
            params={"limit": limit},
        )
