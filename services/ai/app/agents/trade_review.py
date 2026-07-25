from app.tools.trade.get_trade_details import get_trade_details

from app.providers.provider_factory import ProviderFactory

from app.prompts.trade_review import TRADE_REVIEW_SYSTEM_PROMPT

from app.schemas.trade_review_schema import TradeReviewResponse


class TradeReviewAgent:

    async def run(
        self,
        token: str,
        trade_id: str,
    ):

        trade = await get_trade_details(
            token,
            trade_id,
        )

        provider = ProviderFactory.get_provider()

        prompt = f"""
Trade Details

{trade}
"""

        result = await provider.generate_structured(
            prompt=prompt,
            system_prompt=TRADE_REVIEW_SYSTEM_PROMPT,
            schema=TradeReviewResponse,
        )

        return result.model_dump()


trade_review_agent = TradeReviewAgent()
