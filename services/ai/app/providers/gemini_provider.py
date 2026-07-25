from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import (
    HumanMessage,
    SystemMessage,
)

from typing import Type
from pydantic import BaseModel
import json

from app.config.settings import settings
from app.providers.base_provider import BaseProvider

class GeminiProvider(BaseProvider):

    def __init__(self):

        self.llm = ChatGoogleGenerativeAI(
            model=settings.model_name,
            api_key=settings.google_api_key,
            temperature=settings.temperature,
        )

    async def generate(
        self,
        prompt: str,
        system_prompt: str | None = None,
    ) -> str:

        messages = []

        if system_prompt:
            messages.append(
                SystemMessage(content=system_prompt)
            )

        messages.append(
            HumanMessage(content=prompt)
        )

        response = await self.llm.ainvoke(messages)

        if isinstance(response.content, str):
            return response.content

        if isinstance(response.content, list):
            for item in response.content:
                if isinstance(item, dict):
                    if item.get("type") == "text":
                        return item.get("text", "")

                if hasattr(item, "text"):
                    return item.text

        return str(response.content)
    
    
    async def generate_structured(
        self,
        prompt: str,
        schema: Type[BaseModel],
        system_prompt: str | None = None,
    ) -> BaseModel:

        response = await self.generate(
            prompt=prompt,
            system_prompt=system_prompt,
        )

        try:
            data = json.loads(response)
            return schema.model_validate(data)

        except json.JSONDecodeError as e:
            raise ValueError(
                f"Model did not return valid JSON.\n\n{response}"
            ) from e

        except Exception as e:
            raise ValueError(
                f"Failed to validate structured response.\n\n{e}"
            ) from e