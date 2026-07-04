# ---
# File: backend/providers/actions/discord_action.py
# Function: Specialized, user-friendly wrapper around an HTTP request, formatted specifically for Discord Webhooks.
# ---
import httpx
from typing import Dict, Any
from backend.providers.actions.base_action import BaseAction

class DiscordAction(BaseAction):
    """
    Posts a formatted message to a Discord Webhook URL.
    """
    async def execute(self, context: Dict[str, Any]) -> Dict[str, Any]: 
        config = context.get("config", {})

        webhook_url = config.get("webhook_url")
        message = config.get("message")

        if not webhook_url or not message:
            raise ValueError("Discord action failed: Required both `webhook_url` and `message`.")
        
        payload = {
            "content": message,
            "username": config.get("username", "Workflow Engine bot")
        }

        async with httpx.AsyncClient() as client:
            response = await client.post(webhook_url, json=payload)

            response.raise_for_status()

            return {
                "success": "success",
                "delivered_message": message
            }
        

