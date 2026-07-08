# ---
# File: backend/providers/actions/http_action.py
# Function: This is a generic outbound webhook node.
# ---
from pydantic import Field, BaseModel
import httpx
from typing import Dict, Any
from backend.providers.base import BaseAction, ProviderMetadata, BaseStepConfig

class HTTPRequestConfig(BaseStepConfig):
    url: str = Field(..., description="The target URL for the request", format="uri")
    method: str = Field("GET", description="HTTP Method (GET, POST, PUT, PATCH, DELETE)")
    headers: Dict[str, str] = Field(default_factory=dict, description="Key-value pairs for HTTP headers")
    payload: Dict[str, Any] = Field(default_factory=dict, description="JSON body or query parameters")

class HTTPRequestAction(BaseAction):
    """
    Makes an asynchronous outbound HTTP request to external APIs.
    """

    metadata = ProviderMetadata(
        name="http_request",
        type="ACTION",
        display_name="HTTP Request",
        version="1.0",
        category="Network",
        description="Make customizable outbound HTTP requests to external APIs.",
        icon="globe-simple"
    )
    config_model = HTTPRequestConfig

    async def execute(self, context: Dict[str, Any]) -> Dict[str, Any]:
        config = self.config_model(**context.get("config", {}))
        method = config.method.upper()
        
        async with httpx.AsyncClient() as client:
            response = await client.request(
                method=method,
                url=config.url,
                headers=config.headers,
                json=config.payload if method in ["POST", "PUT", "PATCH"] else None,
                params=config.payload if method == "GET" else None
            )

            # Enforce Fail-Fast: Abort if the external server returns an error code
            response.raise_for_status()

            # Attempt to parse JSON response, fallback to plain text if not JSON
            try:
                response_data = response.json()
            except ValueError:
                response_data = response.text

            
            return {
                "status_code": response.status_code,
                "response": response_data
            }