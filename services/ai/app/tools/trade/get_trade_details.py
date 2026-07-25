from app.services.trade_service import TradeService


trade = TradeService()


async def get_trade_details(
    token: str,
    trade_id: str,
):

    response = await trade.trade_details(
        token,
        trade_id,
    )

    return response["data"]
