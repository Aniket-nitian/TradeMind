from pydantic import BaseModel


class Insight(BaseModel):
    observation: str
    coaching: str


class PsychologyResponse(BaseModel):
    summary: str
    fear: Insight
    greed: Insight
    fomo: Insight
    revengeTrading: Insight
    overconfidence: Insight
    impulsiveness: Insight
