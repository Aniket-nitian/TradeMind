from app.services.api_client import APIClient


class SubscriptionService:

    def __init__(self):

        self.client = APIClient()

    async def status(
        self,
        token: str,
    ):

        return await self.client.get(
            "/api/v1/subscription",
            token,
        )
