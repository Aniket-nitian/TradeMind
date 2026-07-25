from app.services.trade_service import TradeService


trade = TradeService()


async def get_recent_trades(
    token: str,
):

    response = await trade.recent_trades(
        token
    )

    return response["data"]