from app.graphs.strategy_graph import strategy_graph

from app.providers.provider_factory import ProviderFactory

from app.prompts.strategy import STRATEGY_SYSTEM_PROMPT

from app.schemas.strategy_schema import StrategyAdvisorResponse


class StrategyAgent:

    async def run(
        self,
        token: str,
    ):

        state = await strategy_graph.ainvoke(
            {
                "token": token
            }
        )

        provider = ProviderFactory.get_provider()

        prompt = f"""
Saved Strategies

{state['strategies']}

Strategy Performance Analytics

{state['analytics']}
"""

        result = await provider.generate_structured(
            prompt=prompt,
            system_prompt=STRATEGY_SYSTEM_PROMPT,
            schema=StrategyAdvisorResponse,
        )

        return result.model_dump()


strategy_agent = StrategyAgent()
