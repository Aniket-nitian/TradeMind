from fastapi import APIRouter

from app.api.ai_routes import router as ai_router
from app.api.daily_brief_routes import router as daily_brief_router
from app.api.trade_review_routes import router as trade_review_router
from app.api.psychology_routes import router as psychology_router
from app.api.strategy_routes import router as strategy_router
from app.api.performance_routes import router as performance_router
from app.api.journal_routes import router as journal_router
from app.api.chat_routes import router as chat_router
from app.api.rag_routes import router as rag_router
from app.api.memory_routes import router as memory_router
from app.api.news_routes import router as news_router

router = APIRouter(prefix="/api/v1")

router.include_router(ai_router)
router.include_router(daily_brief_router)
router.include_router(trade_review_router)
router.include_router(psychology_router)
router.include_router(strategy_router)
router.include_router(performance_router)
router.include_router(journal_router)
router.include_router(chat_router)
router.include_router(rag_router)
router.include_router(memory_router)
router.include_router(news_router)


@router.get("/ping")
async def ping():
    return {
        "message": "pong"
    }