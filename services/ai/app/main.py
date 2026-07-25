from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import router
from app.config.settings import settings

app = FastAPI(
    title="TradeMind AI Service",
    description="AI Engine for TradeMind AI",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.cors_origin],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)


@app.get("/")
async def root():
    return {
        "service": "TradeMind AI",
        "status": "running",
        "environment": settings.environment,
        "model": settings.model_name,
    }


@app.get("/health")
async def health():
    return {
        "status": "healthy"
    }