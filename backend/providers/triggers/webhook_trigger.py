from typing import Dict, Any
from pydantic import BaseModel

from backend.providers.base import BaseTrigger, ProviderMetadata

class WebhookConfig(BaseModel):
    # Webhooks typically don't have complex configurations per step, 
    # as the routing is handled by the URL endpoint itself.
    # We use an empty model to satisfy the BaseProvider contract.
    pass


class WebhookTrigger(BaseTrigger):
    """
    A passive provider class for Webhook triggers.
    The actual HTTP ingestion happens in the FastAPI route layer.
    This class exists to fulfill the registry contract and pass payload data into the context.
    """
    metadata = ProviderMetadata(
        name="webhook",
        type="TRIGGER",
        display_name="Webhook Trigger",
        version="1.0",
        category="Network",
        description="Trigger a workflow via an incoming HTTP Webhook.",
        icon="globe"
    )
    config_model = WebhookConfig

    async def execute(self, context: Dict[str, Any]) -> Dict[str, Any]:
        # Triggers pass their payload forward into the execution context bus.
        return context