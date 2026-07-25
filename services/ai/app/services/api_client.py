import httpx

from app.config.settings import settings


class APIClient:

    def __init__(self):

        self.base_url = settings.api_url.rstrip("/")

        self.timeout = 30

    async def get(
        self,
        endpoint: str,
        token: str | None = None,
        params: dict | None = None,
    ):

        headers = {}

        if token:
            headers["Authorization"] = f"Bearer {token}"

        async with httpx.AsyncClient(
            timeout=self.timeout
        ) as client:

            response = await client.get(
                f"{self.base_url}{endpoint}",
                headers=headers,
                params=params,
            )

            response.raise_for_status()

            return response.json()

    async def post(
        self,
        endpoint: str,
        data: dict,
        token: str | None = None,
    ):

        headers = {}

        if token:
            headers["Authorization"] = f"Bearer {token}"

        async with httpx.AsyncClient(
            timeout=self.timeout
        ) as client:

            response = await client.post(
                f"{self.base_url}{endpoint}",
                headers=headers,
                json=data,
            )

            response.raise_for_status()

            return response.json()

    async def put(
        self,
        endpoint: str,
        data: dict,
        token: str | None = None,
    ):

        headers = {}

        if token:
            headers["Authorization"] = f"Bearer {token}"

        async with httpx.AsyncClient(
            timeout=self.timeout
        ) as client:

            response = await client.put(
                f"{self.base_url}{endpoint}",
                headers=headers,
                json=data,
            )

            response.raise_for_status()

            return response.json()