from app.services.api_client import APIClient


class StrategyService:

    def __init__(self):

        self.client = APIClient()

    async def list_strategies(
        self,
        token: str,
    ):

        return await self.client.get(
            "/api/v1/strategies",
            token,
        )
