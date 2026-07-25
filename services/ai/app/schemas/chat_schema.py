from pydantic import BaseModel


class ChatRequest(BaseModel):
    conversationId: str | None = None
    message: str


class ChatResponse(BaseModel):
    conversationId: str
    reply: str
