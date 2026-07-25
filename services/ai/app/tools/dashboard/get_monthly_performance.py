from app.services.dashboard_service import DashboardService


dashboard = DashboardService()


async def get_monthly_performance(
    token: str,
):

    response = await dashboard.monthly_performance(
        token
    )

    return response["data"]
