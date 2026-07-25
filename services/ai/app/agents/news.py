from app.tools.trade.get_recent_trades import get_recent_trades
from app.services.news_service import news_service

from app.providers.provider_factory import ProviderFactory

from app.prompts.news import NEWS_SYSTEM_PROMPT

from app.schemas.news_schema import NewsAnalysisResponse

MAX_SYMBOLS = 5


class NewsAgent:

    async def run(self, token: str):

        response = await get_recent_trades(token)
        trades = response.get("trades", [])

        symbols: list[str] = []

        for trade in trades:
            symbol = trade.get("symbol")

            if symbol and symbol not in symbols:
                symbols.append(symbol)

            if len(symbols) >= MAX_SYMBOLS:
                break

        if not symbols:
            return NewsAnalysisResponse(
                symbolsCovered=[],
                items=[],
                overallNote="No trades logged yet, so there are no "
                "symbols to fetch news for.",
            ).model_dump()

        articles = await news_service.search(symbols)

        if not articles:
            return NewsAnalysisResponse(
                symbolsCovered=[],
                items=[],
                overallNote=f"No recent news found for: {', '.join(symbols)}.",
            ).model_dump()

        provider = ProviderFactory.get_provider()

        prompt = f"""
Trader's Symbols

{symbols}

Raw News Articles

{articles}
"""

        result = await provider.generate_structured(
            prompt=prompt,
            system_prompt=NEWS_SYSTEM_PROMPT,
            schema=NewsAnalysisResponse,
        )

        return result.model_dump()


news_agent = NewsAgent()
