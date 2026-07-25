from app.services.dashboard_service import DashboardService


dashboard = DashboardService()


async def get_strategy_analytics(
    token: str,
):

    response = await dashboard.strategies(
        token
    )

    return response["data"]
