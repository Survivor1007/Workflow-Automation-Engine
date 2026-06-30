from typing import Dict, Any
from backend.providers.triggers.base_trigger import BaseTrigger

class WebhookTrigger(BaseTrigger):
    """
    Translates inbound raw HTTP webhook requests into the primary context payload.
    """
    
    async def execute(self, **kwargs) -> Dict[str, Any]:
        # FastApi routes will pass the HTTP request components via kwargs
        payload = kwargs.get("payload", {})
        headers = kwargs.get("headers", {})
        query_params = kwargs.get("query_params", {})

        # We return a structured dictionary that becomes the `{{ trigger }}` 
        # namespace in the shared data bus.
        return {
            "body": payload,
            "headers": headers,
            "query": query_params,
            "event_type": "http_webhook"
        }