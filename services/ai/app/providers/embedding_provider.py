from langchain_google_genai import GoogleGenerativeAIEmbeddings

from app.config.settings import settings


class EmbeddingProvider:

    def __init__(self):

        self.model = GoogleGenerativeAIEmbeddings(
            model="models/gemini-embedding-001",
            google_api_key=settings.google_api_key,
        )

    async def embed_text(self, text: str) -> list[float]:

        return await self.model.aembed_query(text)

    async def embed_texts(self, texts: list[str]) -> list[list[float]]:

        return await self.model.aembed_documents(texts)


_embedding_provider: EmbeddingProvider | None = None


def get_embedding_provider() -> EmbeddingProvider:
    global _embedding_provider

    if _embedding_provider is None:
        _embedding_provider = EmbeddingProvider()

    return _embedding_provider
