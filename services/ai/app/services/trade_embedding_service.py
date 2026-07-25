from app.services.api_client import APIClient


class TradeEmbeddingService:

    def __init__(self):

        self.client = APIClient()

    async def pending(
        self,
        token: str,
    ):

        return await self.client.get(
            "/api/v1/trades/embeddings/pending",
            token,
        )

    async def save(
        self,
        token: str,
        trade_id: str,
        embedding: list[float],
    ):

        return await self.client.post(
            f"/api/v1/trades/{trade_id}/embedding",
            {"embedding": embedding},
            token,
        )

    async def embedded(
        self,
        token: str,
    ):

        return await self.client.get(
            "/api/v1/trades/embeddings",
            token,
        )
