from pathlib import Path

# Base directory dynamically resolve to the `backend` folder
BASE_DIR = Path(__file__).resolve().parent.parent 

# Centralized logs
LOGS_DIR = BASE_DIR / "logs"

PROVIDER_LOG_PATH = LOGS_DIR / "providers.jsonl"
ENGINE_LOG_PATH = LOGS_DIR / "engine.jsonl"
WORKFLOW_LOG_PATH = LOGS_DIR / "workflow.jsonl"

STATUS_PENDING = "PENDING"
STATUS_RUNNING = "RUNNING"
STATUS_FAILED = "FAILED"
STATUS_SUCCESS = "SUCCESS"