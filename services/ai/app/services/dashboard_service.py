from app.services.api_client import APIClient


class DashboardService:

    def __init__(self):

        self.client = APIClient()

    async def overview(
        self,
        token: str,
    ):

        return await self.client.get(
            "/api/v1/dashboard/overview",
            token,
        )

    async def psychology(
        self,
        token: str,
    ):

        return await self.client.get(
            "/api/v1/dashboard/psychology",
            token,
        )

    async def mistakes(
        self,
        token: str,
    ):

        return await self.client.get(
            "/api/v1/dashboard/mistakes",
            token,
        )

    async def confidence(
        self,
        token: str,
    ):

        return await self.client.get(
            "/api/v1/dashboard/confidence",
            token,
        )

    async def streaks(
        self,
        token: str,
    ):

        return await self.client.get(
            "/api/v1/dashboard/streaks",
            token,
        )

    async def strategies(
        self,
        token: str,
    ):

        return await self.client.get(
            "/api/v1/dashboard/strategies",
            token,
        )

    async def equity_curve(
        self,
        token: str,
    ):

        return await self.client.get(
            "/api/v1/dashboard/equity-curve",
            token,
        )

    async def monthly_performance(
        self,
        token: str,
    ):

        return await self.client.get(
            "/api/v1/dashboard/monthly-performance",
            token,
        )

    async def drawdown(
        self,
        token: str,
    ):

        return await self.client.get(
            "/api/v1/dashboard/drawdown",
            token,
        )