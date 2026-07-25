import httpx
from fastapi import APIRouter, Header, HTTPException

from app.agents.news import news_agent
from app.agents.market_news import market_news_agent
from app.schemas.news_schema import NewsAnalysisResponse
from app.schemas.market_news_schema import MarketNewsResponse

router = APIRouter()


@router.get("/news/market", response_model=MarketNewsResponse)
async def market_news():
    try:
        return await market_news_agent.run()

    except httpx.HTTPStatusError as e:
        raise HTTPException(
            status_code=e.response.status_code,
            detail="Failed to fetch market news.",
        ) from e


@router.get("/news", response_model=NewsAnalysisResponse)
async def news(
    authorization: str = Header(...),
):

    token = authorization.replace(
        "Bearer ",
        ""
    )

    try:
        return await news_agent.run(token)

    except httpx.HTTPStatusError as e:
        raise HTTPException(
            status_code=e.response.status_code,
            detail=e.response.json().get("message", "Failed to fetch news."),
        ) from e
