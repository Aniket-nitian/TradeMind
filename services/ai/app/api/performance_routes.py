import httpx
from fastapi import APIRouter, Header, HTTPException

from app.agents.performance import performance_agent

router = APIRouter()


@router.get("/performance/coach")
async def performance_coach(
    authorization: str = Header(...),
):

    token = authorization.replace(
        "Bearer ",
        ""
    )

    try:
        return await performance_agent.run(token)

    except httpx.HTTPStatusError as e:
        raise HTTPException(
            status_code=e.response.status_code,
            detail=e.response.json().get("message", "Failed to fetch performance data."),
        ) from e
