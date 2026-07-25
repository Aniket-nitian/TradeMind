from app.services.dashboard_service import DashboardService


dashboard = DashboardService()


async def get_dashboard_overview(
    token: str,
):

    response = await dashboard.overview(
        token
    )

    return response["data"]