# ---
# File: backend/providers/triggers/cron_trigger.py
# Function: Register cron with the provider
# ---
from typing import Dict, Any
from backend.providers.triggers.base_trigger import BaseTrigger

class CronTrigger(BaseTrigger):
    """
    A passive provider class. 
    The actual scheduling execution is handled by the APScheduler in engine/scheduler.py.
    This class exists to fulfill the registry contract.
    """
    async def execute(self, context: Dict[str, Any]) -> Dict[str, Any]:
        return context