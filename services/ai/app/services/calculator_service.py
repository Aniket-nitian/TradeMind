from app.services.api_client import APIClient


class CalculatorService:

    def __init__(self):

        self.client = APIClient()

    async def position_size(
        self,
        token: str,
        payload: dict,
    ):

        return await self.client.post(
            "/api/v1/calculator/position-size",
            payload,
            token,
        )