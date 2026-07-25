from abc import ABC, abstractmethod
from typing import Type
from pydantic import BaseModel


class BaseProvider(ABC):

    @abstractmethod
    async def generate(
        self,
        prompt: str,
        system_prompt: str | None = None,
    ) -> str:
        """
        Generate plain text.
        """
        pass

    @abstractmethod
    async def generate_structured(
        self,
        prompt: str,
        schema: Type[BaseModel],
        system_prompt: str | None = None,
    ) -> BaseModel:
        """
        Generate structured output validated
        against a Pydantic schema.
        """
        pass