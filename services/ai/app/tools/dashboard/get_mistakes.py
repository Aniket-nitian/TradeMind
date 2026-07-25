from app.services.dashboard_service import DashboardService


dashboard = DashboardService()


async def get_mistakes(
    token: str,
):

    response = await dashboard.mistakes(
        token
    )

    return response["data"]