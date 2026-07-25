from app.graphs.daily_brief_graph import daily_brief_graph

from app.providers.provider_factory import ProviderFactory

from app.prompts.daily_brief_prompt import SYSTEM_PROMPT

from app.schemas.daily_brief_schema import DailyBriefResponse


class DailyBriefAgent:

    async def run(
        self,
        token: str,
    ):

        state = await daily_brief_graph.ainvoke(
            {
                "token": token
            }
        )

        provider = ProviderFactory.get_provider()

        prompt = f"""
Dashboard Overview

{state['overview']}

Psychology

{state['psychology']}

Confidence

{state['confidence']}

Mistakes

{state['mistakes']}

Recent Trades

{state['recent_trades']}

Previous Day Trades

{state['previous_day_trades']}

Market News Articles

{state['market_news']}
"""

        result = await provider.generate_structured(
            prompt=prompt,
            system_prompt=SYSTEM_PROMPT,
            schema=DailyBriefResponse,
        )

        return result.model_dump()


daily_brief_agent = DailyBriefAgent()