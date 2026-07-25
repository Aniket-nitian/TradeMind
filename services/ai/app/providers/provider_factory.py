from app.providers.gemini_provider import GeminiProvider


class ProviderFactory:

    @staticmethod
    def get_provider():

        return GeminiProvider()