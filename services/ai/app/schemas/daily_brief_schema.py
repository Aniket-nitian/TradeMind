from pydantic import BaseModel


class Insight(BaseModel):
    observation: str
    coaching: str


class Improvement(BaseModel):
    observation: str
    coaching: str


class DailyBriefResponse(BaseModel):
    previousDaySummary: str
    marketSummary: str
    tradingChecklist: list[str]
    riskReminder: str
    psychology: Insight
    discipline: Insight
    riskManagement: Insight
    execution: Insight
    confidence: Insight
    improvement: Improvement