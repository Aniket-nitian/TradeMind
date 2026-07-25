import httpx

from app.config.settings import settings


class NewsService:

    def __init__(self):

        self.base_url = "https://newsapi.org/v2/everything"

        self.timeout = 20

    async def search(
        self,
        symbols: list[str],
        page_size: int = 15,
    ) -> list[dict]:

        if not symbols:
            return []

        query = " OR ".join(f'"{symbol}"' for symbol in symbols)

        params = {
            "q": query,
            "sortBy": "publishedAt",
            "language": "en",
            "pageSize": page_size,
            "apiKey": settings.news_api_key,
        }

        async with httpx.AsyncClient(timeout=self.timeout) as client:

            response = await client.get(self.base_url, params=params)

            response.raise_for_status()

            data = response.json()

        return data.get("articles", [])

    async def top_market_headlines(self, page_size: int = 30) -> list[dict]:

        query = (
            '"stock market" OR Sensex OR Nifty OR NSE OR BSE OR RBI OR SEBI '
            'OR "Indian markets" OR "share market" OR "Indian economy"'
        )

        params = {
            "q": query,
            "sortBy": "publishedAt",
            "language": "en",
            "pageSize": page_size,
            "apiKey": settings.news_api_key,
        }

        async with httpx.AsyncClient(timeout=self.timeout) as client:

            response = await client.get(self.base_url, params=params)

            response.raise_for_status()

            data = response.json()

        return data.get("articles", [])


news_service = NewsService()
