from fastapi import APIRouter

from app.providers.provider_factory import ProviderFactory

router = APIRouter(
    prefix="/ai",
    tags=["AI"],
)


@router.post("/test")
async def test_ai():

    provider = ProviderFactory.get_provider()

    response = await provider.generate(
        prompt="Say hello in one sentence.",
        system_prompt="You are the AI engine of TradeMind AI.",
    )

    return {
        "response": response
    }