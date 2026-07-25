from app.services.strategy_service import StrategyService


strategy_service = StrategyService()


async def list_strategies(
    token: str,
):

    response = await strategy_service.list_strategies(
        token
    )

    return response["data"]
