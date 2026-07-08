# ---
# File: backend/core/logger.py
# ---
import json
import time 
from datetime import datetime, timezone
from typing import Dict, Any

from backend.core.constants import PROVIDER_LOG_PATH, WORKFLOW_LOG_PATH, ENGINE_LOG_PATH

class SystemLogger:
    """
    Centralized structured logging for the Workflow Automation Engine.
    Routes log entries to the appropriate isolated JSONL files.
    """
    @staticmethod
    def _write_log(path: str, level: str, source: str, message: str, metadata: Dict[str, Any] | None = None):
        entry = {
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "level": level.upper(),
            "source": source,
            "message": message
        }

        if metadata:
            entry["metadata"] = metadata
        
        with open(path, "a", encoding="utf-8") as f:
            f.write(json.dumps(entry) + "\n")
        
    @classmethod
    def engine(cls, level: str, message: str, metadata: Dict[str, Any] | None = None):
        cls._write_log(ENGINE_LOG_PATH, level, "CORE_ENGINE", message, metadata)

    @classmethod
    def provider(cls, level: str, provider_name: str, message: str, metadata: Dict[str, Any] | None = None):
        cls._write_log(PROVIDER_LOG_PATH, level, f"PROVIDER::{provider_name.upper()}", message, metadata)

    @classmethod
    def workflow(cls, level: str, workflow_id: int, message: str, metadata: Dict[str, Any] | None = None):
        cls._write_log(WORKFLOW_LOG_PATH, level, f"WORKFLOW::{workflow_id}", message, metadata) 

