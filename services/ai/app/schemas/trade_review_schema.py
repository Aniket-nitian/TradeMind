from pydantic import BaseModel


class Insight(BaseModel):
    observation: str
    coaching: str


class TradeReviewResponse(BaseModel):
    score: int
    entry: Insight
    exit: Insight
    riskManagement: Insight
    emotion: Insight
    discipline: Insight
    mistakes: list[str]
    improvements: list[str]
