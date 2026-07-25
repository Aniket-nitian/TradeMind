from app.services.api_client import APIClient


class AiConversationService:

    def __init__(self):

        self.client = APIClient()

    async def create_conversation(
        self,
        token: str,
        title: str | None = None,
    ):

        return await self.client.post(
            "/api/v1/ai/conversations",
            {"title": title} if title else {},
            token,
        )

    async def get_conversation(
        self,
        token: str,
        conversation_id: str,
    ):

        return await self.client.get(
            f"/api/v1/ai/conversations/{conversation_id}",
            token,
        )

    async def add_message(
        self,
        token: str,
        conversation_id: str,
        role: str,
        content: str,
    ):

        return await self.client.post(
            f"/api/v1/ai/conversations/{conversation_id}/messages",
            {"role": role, "content": content},
            token,
        )
