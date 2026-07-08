# ---
# File: backend/providers/actions/logger_action.py
# Function: Defines the logging folder by their type and logging structure
# ---
from pydantic import Field, BaseModel
import json
from datetime import datetime, timezone
from typing import Dict, Any

from backend.providers.base import BaseAction, ProviderMetadata, BaseStepConfig
from backend.core.constants import LOGS_DIR, PROVIDER_LOG_PATH

class LoggerConfig(BaseStepConfig):
    message: str = Field("No message provided", description="The message to log. Jinja templating allowed.")
    level: str = Field("INFO", description="Log level (INFO, WARNING, ERROR, DEBUG)")
    include_context: bool = Field(False, description="Whether to dump the entire context into the log")


class LoggerAction(BaseAction):
    """
    Outputs structured context or messages directly to local JSONL logs 
    for real-time debugging and verification.
    """
    metadata = ProviderMetadata(
        name="logger",
        type="ACTION",
        display_name="Logger",
        version="1.0",
        category="Utility",
        description="Write messages and context dumps to the system logs.",
        icon="terminal"
    )
    config_model = LoggerConfig

    def __init__(self):
        # Safely ensure the logs directory exists using pathlib
        LOGS_DIR.makedirs(parents=True, exist_ok=True)
        self.log_file = PROVIDER_LOG_PATH
    
    async def execute(self, context: Dict[str, Any]) -> Dict[str, Any]:
        # Validate configuration
        config = self.config_model(**context.get("config", {}))

        

        # Build the structured log entry as specified in the docs
        log_entry = {
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "level": config.level.upper(),
            "source": "LoggerAction",
            "message": config.message
        }

        # If debug mode is on, dump the entire historical execution context
        if config.include_context:
            # Exclude the current step config to prevent infinite nesting loops
            safe_context = {k: v for k, v in context.items() if k != "config"}
            log_entry["context_snapshot"] = safe_context

        # Append to the line-delimited text stream
        with open(self.log_file, "a") as f:
            f.write(json.dumps(log_entry) + "\n")

        return {
            "logged_level": config.level,
            "logged_message": config.message,
            "status": "success"
        }
