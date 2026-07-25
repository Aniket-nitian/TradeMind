import httpx
from fastapi import APIRouter, Header, HTTPException

from app.services.rag_service import rag_service
from app.schemas.rag_schema import (
    RagEmbedResponse,
    RagSearchRequest,
    RagSearchResponse,
)

router = APIRouter()


@router.post("/rag/embed", response_model=RagEmbedResponse)
async def embed_pending_trades(
    authorization: str = Header(...),
):

    token = authorization.replace(
        "Bearer ",
        ""
    )

    try:
        count = await rag_service.embed_pending_trades(token)

        return {"embedded": count}

    except httpx.HTTPStatusError as e:
        raise HTTPException(
            status_code=e.response.status_code,
            detail=e.response.json().get("message", "Failed to embed trades."),
        ) from e


@router.post("/rag/search", response_model=RagSearchResponse)
async def search_journal(
    body: RagSearchRequest,
    authorization: str = Header(...),
):

    token = authorization.replace(
        "Bearer ",
        ""
    )

    try:
        results = await rag_service.retrieve_relevant_trades(
            token,
            body.query,
            body.topK,
        )

        return {"results": results}

    except httpx.HTTPStatusError as e:
        raise HTTPException(
            status_code=e.response.status_code,
            detail=e.response.json().get("message", "Failed to search journal."),
        ) from e
