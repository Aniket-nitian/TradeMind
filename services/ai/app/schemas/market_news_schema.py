from pydantic import BaseModel


class MarketNewsItem(BaseModel):
    headline: str
    source: str
    url: str
    sentiment: str
    publishedAt: str


class MarketNewsResponse(BaseModel):
    items: list[MarketNewsItem]
