from app.services.api_client import APIClient


class TradeService:

    def __init__(self):

        self.client = APIClient()

    async def recent_trades(
        self,
        token: str,
    ):

        return await self.client.get(
            "/api/v1/trades",
            token,
        )

    async def trade_details(
        self,
        token: str,
        trade_id: str,
    ):

        return await self.client.get(
            f"/api/v1/trades/{trade_id}/details",
            token,
        )