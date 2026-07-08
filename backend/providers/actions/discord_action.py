# ---
# File: backend/providers/actions/discord_action.py
# Function: Specialized, user-friendly wrapper around an HTTP request, formatted specifically for Discord Webhooks.
# ---
import httpx
from typing import Dict, Any
from pydantic import BaseModel, Field

from backend.providers.actions.base_action import BaseAction
from backend.providers.base import ProviderMetadata, BaseStepConfig

# 1. Define specific configuration schema for this provider
class DiscordConfig(BaseStepConfig):
    webhook_url: str = Field(..., description="The Discord Webhook URL", format="uri")
    message: str = Field(..., description="The message payload to send to discord")
    username: str = Field("Workflow Engine Bot", description="Override the bot's username")


class DiscordAction(BaseAction):
    """
    Posts a formatted message to a Discord Webhook URL.
    """
    # 2. Attach metadata
    metadata = ProviderMetadata(
        name = "discord",
        type = "ACTION",
        display_name="Discord Webhook",
        version = "1.0",
        category = "Messaging",
        description= "Send a formatted message to a Discord channel via Webhook.",
        icon= "discord-logo"
    )

    # 3. Attach Config Schema
    config_model = DiscordConfig

    async def execute(self, context: Dict[str, Any]) -> Dict[str, Any]: 
        config = self.config_model(**context.get("config", {}))

        # webhook_url = config.get("webhook_url")
        # message = config.get("message")

        # if not webhook_url or not message:
        #     raise ValueError("Discord action failed: Required both `webhook_url` and `message`.")
        
        payload = {
            "content": config.message,
            "username": config.get("username", "Workflow Engine bot")
        }

        async with httpx.AsyncClient() as client:
            response = await client.post(config.webhook_url, json=payload)

            response.raise_for_status()

            return {
                "status": "success",
                "delivered_message": config.message
            }
        

