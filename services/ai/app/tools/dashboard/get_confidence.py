from app.services.dashboard_service import DashboardService


dashboard = DashboardService()


async def get_confidence(
    token: str,
):

    response = await dashboard.confidence(
        token
    )

    return response["data"]