# ---
# File: backend/providers/actions/http_action.py
# Function: This is a generic outbound webhook node.
# ---
import httpx
from typing import Dict, Any
from backend.providers.actions.base_action import BaseAction

class HTTPRequestAction(BaseAction):
    """
    Makes an asynchronous outbound HTTP request to external APIs.
    """
    async def execute(self, context: Dict[str, Any]) -> Dict[str, Any]:
        config = context.get("config", {})

        url = config.get("url")
        method = config.get("method", "GET").upper()
        headers = config.get("headers", {})
        payload = config.get("payload", {})

        if not url:
            raise ValueError("HTTP Request Action failed: Missing required 'url' in configuration.")
        
        async with httpx.AsyncClient() as client:
            response = await client.request(
                method=method,
                url=url,
                headers=headers,
                json=payload if method in ["POST", "PUT", "PATCH"] else None,
                params=payload if method == "GET" else None
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