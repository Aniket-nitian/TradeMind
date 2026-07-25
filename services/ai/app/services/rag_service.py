from app.services.trade_embedding_service import TradeEmbeddingService
from app.providers.embedding_provider import get_embedding_provider


def _cosine_similarity(a: list[float], b: list[float]) -> float:

    dot = sum(x * y for x, y in zip(a, b))

    norm_a = sum(x * x for x in a) ** 0.5
    norm_b = sum(y * y for y in b) ** 0.5

    if norm_a == 0 or norm_b == 0:
        return 0.0

    return dot / (norm_a * norm_b)


def _build_journal_text(trade: dict) -> str:

    parts = [
        trade.get("symbol"),
        trade.get("reasonForEntry"),
        trade.get("reasonForExit"),
        trade.get("tradeNotes"),
        trade.get("lessonLearned"),
    ]

    return "\n".join(p for p in parts if p)


class RagService:

    def __init__(self):

        self.embeddings = TradeEmbeddingService()

    async def embed_pending_trades(self, token: str) -> int:

        pending = await self.embeddings.pending(token)
        trades = pending["data"]

        embedded_count = 0

        for trade in trades:

            text = _build_journal_text(trade)

            if not text:
                continue

            vector = await get_embedding_provider().embed_text(text)

            await self.embeddings.save(
                token,
                trade["id"],
                vector,
            )

            embedded_count += 1

        return embedded_count

    async def retrieve_relevant_trades(
        self,
        token: str,
        query: str,
        top_k: int = 3,
    ) -> list[dict]:

        response = await self.embeddings.embedded(token)
        trades = response["data"]

        if not trades:
            return []

        query_vector = await get_embedding_provider().embed_text(query)

        scored = [
            {
                **{k: v for k, v in trade.items() if k != "embedding"},
                "relevance": _cosine_similarity(
                    query_vector,
                    trade["embedding"],
                ),
            }
            for trade in trades
        ]

        scored.sort(key=lambda t: t["relevance"], reverse=True)

        return scored[:top_k]


rag_service = RagService()
