from app.services.dashboard_service import DashboardService


dashboard = DashboardService()


async def get_drawdown(
    token: str,
):

    response = await dashboard.drawdown(
        token
    )

    return response["data"]
