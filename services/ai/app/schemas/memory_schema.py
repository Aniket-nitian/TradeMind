from pydantic import BaseModel


class MemoryResponse(BaseModel):
    summary: str
