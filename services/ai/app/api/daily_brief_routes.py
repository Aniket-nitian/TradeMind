from fastapi import APIRouter, Header, HTTPException

from app.agents.daily_brief import (
    daily_brief_agent,
)
from app.services.subscription_service import SubscriptionService

router = APIRouter()

subscription_service = SubscriptionService()


@router.get("/daily-brief")
async def daily_brief(
    authorization: str = Header(...)
):

    token = authorization.replace(
        "Bearer ",
        ""
    )

    subscription = await subscription_service.status(token)

    if subscription["data"]["plan"] != "PREMIUM":
        raise HTTPException(
            status_code=403,
            detail="The Daily Brief is a Premium feature. Upgrade to unlock it.",
        )

    result = await daily_brief_agent.run(
        token
    )

    return result