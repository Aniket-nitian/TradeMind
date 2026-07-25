from pydantic import BaseModel


class RagSearchRequest(BaseModel):
    query: str
    topK: int = 3


class RagEmbedResponse(BaseModel):
    embedded: int


class RagSearchResult(BaseModel):
    id: str
    symbol: str
    entryTime: str
    netPnl: float | None = None
    reasonForEntry: str | None = None
    reasonForExit: str | None = None
    tradeNotes: str | None = None
    lessonLearned: str | None = None
    relevance: float


class RagSearchResponse(BaseModel):
    results: list[RagSearchResult]
