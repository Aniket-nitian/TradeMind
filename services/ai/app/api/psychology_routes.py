import httpx
from fastapi import APIRouter, Header, HTTPException

from app.agents.psychology import psychology_agent

router = APIRouter()


@router.get("/psychology/coach")
async def psychology_coach(
    authorization: str = Header(...),
):

    token = authorization.replace(
        "Bearer ",
        ""
    )

    try:
        return await psychology_agent.run(token)

    except httpx.HTTPStatusError as e:
        raise HTTPException(
            status_code=e.response.status_code,
            detail=e.response.json().get("message", "Failed to fetch psychology data."),
        ) from e
