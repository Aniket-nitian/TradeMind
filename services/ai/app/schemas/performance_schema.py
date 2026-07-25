from pydantic import BaseModel


class Insight(BaseModel):
    observation: str
    coaching: str


class PerformanceCoachResponse(BaseModel):
    summary: str
    trajectory: Insight
    consistency: Insight
    riskOfRuin: Insight
    strengths: list[str]
    focusAreas: list[str]
