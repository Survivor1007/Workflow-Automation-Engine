# ---
# File: backend/providers/actions/logger_action.py
# Function: Defines the logging folder by their type and logging structure
# ---
import json
from datetime import datetime, timezone
from typing import Dict, Any

from backend.providers.actions.base_action import BaseAction
from backend.core.constants import LOGS_DIR, PROVIDER_LOG_PATH

class LoggerAction(BaseAction):
    """
    Outputs structured context or messages directly to local JSONL logs 
    for real-time debugging and verification.
    """
    def __init__(self):
        # Ensure 'logs' directory exists
        LOGS_DIR.makedirs(parents=True, exist_ok=True)
        self.log_file = PROVIDER_LOG_PATH
    
    async def execute(self, context: Dict[str, Any]) -> Dict[str, Any]:
        config = context.get("config", {})

        message = config.get("message", "No message provided")
        level = config.get("level", "INFO").upper()

        # Build the structured log entry as specified in the docs
        log_entry = {
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "level": level,
            "source": "LoggerAction",
            "message": message
        }

        # If debug mode is on, dump the entire historical execution context
        if config.get("include_context", False):
            # Exclude the current step config to prevent infinite nesting loops
            safe_context = {k: v for k, v in context.items() if k != "config"}
            log_entry["context_snapshot"] = safe_context

        # Append to the line-delimited text stream
        with open(self.log_file, "a") as f:
            f.write(json.dumps(log_entry) + "\n")

        return {
            "logged_level": level,
            "logged_message": message,
            "status": "success"
        }
