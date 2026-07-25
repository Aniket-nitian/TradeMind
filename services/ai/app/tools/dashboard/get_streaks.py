from app.services.dashboard_service import DashboardService


dashboard = DashboardService()


async def get_streaks(
    token: str,
):

    response = await dashboard.streaks(
        token
    )

    return response["data"]
