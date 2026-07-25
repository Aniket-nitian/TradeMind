import httpx
from fastapi import APIRouter, Header, HTTPException

from app.agents.strategy import strategy_agent

router = APIRouter()


@router.get("/strategy/advisor")
async def strategy_advisor(
    authorization: str = Header(...),
):

    token = authorization.replace(
        "Bearer ",
        ""
    )

    try:
        return await strategy_agent.run(token)

    except httpx.HTTPStatusError as e:
        raise HTTPException(
            status_code=e.response.status_code,
            detail=e.response.json().get("message", "Failed to fetch strategy data."),
        ) from e
