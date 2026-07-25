from pydantic import BaseModel


class Insight(BaseModel):
    observation: str
    coaching: str


class JournalAnalysisResponse(BaseModel):
    summary: str
    recurringLessons: list[str]
    planAdherence: Insight
    entryReasoningQuality: Insight
    exitReasoningQuality: Insight
    recommendations: list[str]
