from pydantic import BaseModel


class NewsHighlight(BaseModel):
    title: str
    source: str
    url: str
    publishedAt: str


class SymbolNews(BaseModel):
    symbol: str
    sentiment: str
    summary: str
    relevanceToTrader: str
    highlights: list[NewsHighlight]


class NewsAnalysisResponse(BaseModel):
    symbolsCovered: list[str]
    items: list[SymbolNews]
    overallNote: str
