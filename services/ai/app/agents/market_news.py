import time

from app.services.news_service import news_service
from app.providers.provider_factory import ProviderFactory
from app.prompts.market_news import MARKET_NEWS_SYSTEM_PROMPT
from app.schemas.market_news_schema import MarketNewsResponse

_CACHE_TTL_SECONDS = 15 * 60
_cache: dict[str, object] = {"data": None, "expiresAt": 0.0}

class MarketNewsAgent:

    async def run(self) -> dict:
        now = time.time()

        if _cache["data"] is not None and _cache["expiresAt"] > now:
            return _cache["data"]

        articles = await news_service.top_market_headlines()

        if not articles:
            result = MarketNewsResponse(items=[]).model_dump()
            _cache["data"] = result
            _cache["expiresAt"] = now + _CACHE_TTL_SECONDS
            return result

        provider = ProviderFactory.get_provider()

        prompt = f"""
Raw News Articles

{articles}
"""

        parsed = await provider.generate_structured(
            prompt=prompt,
            system_prompt=MARKET_NEWS_SYSTEM_PROMPT,
            schema=MarketNewsResponse,
        )

        result = parsed.model_dump()

        _cache["data"] = result
        _cache["expiresAt"] = now + _CACHE_TTL_SECONDS

        return result

market_news_agent = MarketNewsAgent()
