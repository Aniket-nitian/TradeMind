import httpx
from fastapi import APIRouter, Header, HTTPException

from app.agents.trade_review import trade_review_agent

router = APIRouter()


@router.get("/trade-review/{trade_id}")
async def trade_review(
    trade_id: str,
    authorization: str = Header(...),
):

    token = authorization.replace(
        "Bearer ",
        ""
    )

    try:
        return await trade_review_agent.run(
            token,
            trade_id,
        )

    except httpx.HTTPStatusError as e:
        raise HTTPException(
            status_code=e.response.status_code,
            detail=e.response.json().get("message", "Failed to fetch trade."),
        ) from e
