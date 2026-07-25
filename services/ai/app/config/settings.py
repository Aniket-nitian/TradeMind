from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    
    environment: str = "development"

    google_api_key: str = ""

    news_api_key: str = ""

    model_name: str = "gemini-2.5-flash"

    temperature: float = 0.2

    api_url: str = "http://localhost:5000"

    cors_origin: str = "http://localhost:5173"

    database_url: str = ""

    model_config = SettingsConfigDict(
        env_file=".env",
        extra="ignore",
    )


settings = Settings()