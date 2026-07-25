import httpx
from fastapi import APIRouter, Header, HTTPException

from app.agents.memory import memory_agent
from app.schemas.memory_schema import MemoryResponse

router = APIRouter()


@router.get("/memory", response_model=MemoryResponse)
async def get_memory(
    authorization: str = Header(...),
):

    token = authorization.replace(
        "Bearer ",
        ""
    )

    try:
        summary = await memory_agent.get_summary(token)

        return {"summary": summary}

    except httpx.HTTPStatusError as e:
        raise HTTPException(
            status_code=e.response.status_code,
            detail=e.response.json().get("message", "Failed to fetch memory."),
        ) from e


@router.post("/memory/refresh", response_model=MemoryResponse)
async def refresh_memory(
    authorization: str = Header(...),
):

    token = authorization.replace(
        "Bearer ",
        ""
    )

    try:
        summary = await memory_agent.refresh(token)

        return {"summary": summary}

    except httpx.HTTPStatusError as e:
        raise HTTPException(
            status_code=e.response.status_code,
            detail=e.response.json().get("message", "Failed to refresh memory."),
        ) from e
