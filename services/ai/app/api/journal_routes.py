import httpx
from fastapi import APIRouter, Header, HTTPException

from app.agents.journal import journal_agent

router = APIRouter()


@router.get("/journal/analysis")
async def journal_analysis(
    authorization: str = Header(...),
):

    token = authorization.replace(
        "Bearer ",
        ""
    )

    try:
        return await journal_agent.run(token)

    except httpx.HTTPStatusError as e:
        raise HTTPException(
            status_code=e.response.status_code,
            detail=e.response.json().get("message", "Failed to fetch trades."),
        ) from e
