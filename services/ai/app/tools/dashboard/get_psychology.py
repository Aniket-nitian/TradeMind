from app.services.dashboard_service import DashboardService


dashboard = DashboardService()


async def get_psychology(
    token: str,
):

    response = await dashboard.psychology(
        token
    )

    return response["data"]