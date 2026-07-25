from app.graphs.psychology_graph import psychology_graph

from app.providers.provider_factory import ProviderFactory

from app.prompts.psychology import PSYCHOLOGY_SYSTEM_PROMPT

from app.schemas.psychology_schema import PsychologyResponse


class PsychologyAgent:

    async def run(
        self,
        token: str,
    ):

        state = await psychology_graph.ainvoke(
            {
                "token": token
            }
        )

        provider = ProviderFactory.get_provider()

        prompt = f"""
Psychology

{state['psychology']}

Confidence

{state['confidence']}

Mistakes

{state['mistakes']}
"""

        result = await provider.generate_structured(
            prompt=prompt,
            system_prompt=PSYCHOLOGY_SYSTEM_PROMPT,
            schema=PsychologyResponse,
        )

        return result.model_dump()


psychology_agent = PsychologyAgent()
