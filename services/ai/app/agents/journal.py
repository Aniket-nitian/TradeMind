from app.tools.trade.get_recent_trades import get_recent_trades

from app.providers.provider_factory import ProviderFactory

from app.prompts.journal import JOURNAL_SYSTEM_PROMPT

from app.schemas.journal_schema import JournalAnalysisResponse


class JournalAgent:

    async def run(
        self,
        token: str,
    ):

        response = await get_recent_trades(token)

        trades = response.get("trades", [])

        journal_entries = [
            {
                "symbol": trade.get("symbol"),
                "side": trade.get("side"),
                "status": trade.get("status"),
                "netPnl": trade.get("netPnl"),
                "tradeNotes": trade.get("tradeNotes"),
                "lessonLearned": trade.get("lessonLearned"),
                "reasonForEntry": trade.get("reasonForEntry"),
                "reasonForExit": trade.get("reasonForExit"),
                "followedPlan": trade.get("followedPlan"),
                "emotionBefore": trade.get("emotionBefore"),
                "emotionAfter": trade.get("emotionAfter"),
            }
            for trade in trades
        ]

        provider = ProviderFactory.get_provider()

        prompt = f"""
Recent Trade Journal Entries

{journal_entries}
"""

        result = await provider.generate_structured(
            prompt=prompt,
            system_prompt=JOURNAL_SYSTEM_PROMPT,
            schema=JournalAnalysisResponse,
        )

        return result.model_dump()


journal_agent = JournalAgent()
