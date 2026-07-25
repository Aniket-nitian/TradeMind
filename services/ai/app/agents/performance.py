from app.graphs.performance_graph import performance_graph

from app.providers.provider_factory import ProviderFactory

from app.prompts.performance import PERFORMANCE_SYSTEM_PROMPT

from app.schemas.performance_schema import PerformanceCoachResponse


class PerformanceAgent:

    async def run(
        self,
        token: str,
    ):

        state = await performance_graph.ainvoke(
            {
                "token": token
            }
        )

        provider = ProviderFactory.get_provider()

        prompt = f"""
Overview

{state['overview']}

Equity Curve

{state['equity_curve']}

Monthly Performance

{state['monthly_performance']}

Drawdown

{state['drawdown']}

Streaks

{state['streaks']}
"""

        result = await provider.generate_structured(
            prompt=prompt,
            system_prompt=PERFORMANCE_SYSTEM_PROMPT,
            schema=PerformanceCoachResponse,
        )

        return result.model_dump()


performance_agent = PerformanceAgent()
