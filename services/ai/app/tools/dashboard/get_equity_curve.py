from app.services.dashboard_service import DashboardService


dashboard = DashboardService()


async def get_equity_curve(
    token: str,
):

    response = await dashboard.equity_curve(
        token
    )

    return response["data"]
