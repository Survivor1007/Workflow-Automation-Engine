# ---
# File: backend/providers/triggers/cron_trigger.py
# Function: Register cron with the provider
# ---
from pydantic import BaseModel, Field
from typing import Dict, Any

from backend.providers.base import BaseTrigger, ProviderMetadata

class CronConfig(BaseModel):
    cron_expression: str = Field(..., description="Standard cron expression (e.g., '*/5 * * * * *')")


class CronTrigger(BaseTrigger):
    """
    A passive provider class. 
    The actual scheduling execution is handled by the APScheduler in engine/scheduler.py.
    This class exists to fulfill the registry contract.
    """

    metadata = ProviderMetadata(
        name="cron",
        type="TRIGGER",
        display_name="Cron Schedule",
        version="1.0",
        category="Schedule",
        description="Trigger a workflow automatically on a scheduled cron interval.",
        icon="clock"
    )
    config_model = CronConfig
    
    async def execute(self, context: Dict[str, Any]) -> Dict[str, Any]:
        return context