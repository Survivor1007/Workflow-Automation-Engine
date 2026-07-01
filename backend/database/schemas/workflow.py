from typing import Dict, Any
from pydantic import BaseModel

class WorkflowCreate(BaseModel):
    name: str
    is_active: bool = True

class StepCreate(BaseModel):
    step_order: int 
    step_type: str # e.g., "TRIGGER" or "ACTION"
    node_provider: str # e.g., "WEBHOOK" or "TEXT_FORMATTER" or "LOGGER"
    config_json: Dict[str, Any] = {}