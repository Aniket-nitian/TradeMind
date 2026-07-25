from typing import Literal

from pydantic import BaseModel


class StrategyInsight(BaseModel):
    name: str
    observation: str
    coaching: str
    recommendation: Literal["KEEP", "ADJUST", "DROP"]


class StrategyAdvisorResponse(BaseModel):
    summary: str
    strategies: list[StrategyInsight]
