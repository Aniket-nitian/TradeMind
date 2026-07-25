import httpx
from fastapi import APIRouter, Header, HTTPException

from app.agents.chat import chat_agent
from app.schemas.chat_schema import ChatRequest, ChatResponse

router = APIRouter()


@router.post("/chat", response_model=ChatResponse)
async def chat(
    body: ChatRequest,
    authorization: str = Header(...),
):

    token = authorization.replace(
        "Bearer ",
        ""
    )

    try:
        return await chat_agent.run(
            token,
            body.conversationId,
            body.message,
        )

    except httpx.HTTPStatusError as e:
        raise HTTPException(
            status_code=e.response.status_code,
            detail=e.response.json().get("message", "Chat request failed."),
        ) from e
