from fastapi import Depends, HTTPException, APIRouter, Request
from sqlalchemy.orm import Session
from typing import Dict, Any

from backend.database.database import get_db
from backend.database.models.workflow import Workflow
from backend.database.models.workflow_step import WorkflowStep
from backend.database.schemas.workflow import WorkflowCreate, StepCreate
from backend.engine.workflow_engine import WorkflowEngine
from backend.providers.triggers.webhook_trigger import WebhookTrigger
from backend.providers.provider_registry import ProviderRegistry

router = APIRouter(tags=["Workflows"])

@router.get("/providers/")
def get_providers():
    """
    Returns all dynamically discovered providers,
    along with their metadata and Pydantic UI Schema.
    """
    return ProviderRegistry.get_all_metadata()

@router.post("/workflows/")
def create_workflow(workflow: WorkflowCreate, db: Session = Depends(get_db)):
    """Creates a new empty workflow pipeline."""
    db_workflow = Workflow(name= workflow.name, is_active = workflow.is_active)
    db.add(db_workflow)
    db.commit()
    db.refresh(db_workflow)
    return {"id": db_workflow.id, "name": db_workflow.name, "status": "created"}

@router.post("/workflows/{workflow_id}/steps/")
def add_workflow_step(workflow_id: int, step: StepCreate, db: Session = Depends(get_db)):
    """Appends a new trigger or node to a specific workflow."""
    workflow = db.query(Workflow).filter(workflow_id == Workflow.id).first()
    if not workflow:
        raise HTTPException(status_code=404, detail="Workflow not found")
    
    db_step = WorkflowStep(
        workflow_id = workflow_id,
        step_order = step.step_order,
        step_type = step.step_type,
        node_provider = step.node_provider,
        config_json = step.config_json
    )
    db.add(db_step)
    db.commit()
    return {"status": "Step added successfully", "step_order": step.step_order}

@router.post("/webhook/{workflow_id}")
async def webhook_trigger(workflow_id: int, request: Request, db: Session = Depends(get_db)):
    """
    The main entry point for external systems. Provide a payload and 
    spins up the workflow Engine to process it sequentially.
    """
    try:
        payload = await request.json()
    except Exception as e:
        payload = {}

    headers = dict(request.headers)
    query_params = dict(request.query_params)

    # 1. Normalize inbound network request using webhook triggers
    trigger = WebhookTrigger()
    trigger_data = await trigger.execute(payload=payload, headers=headers, query_params=query_params)

    # 2. Hand off control to the strictly isolated engine
    engine = WorkflowEngine(db)
    await engine.execute_workflow(workflow_id=workflow_id, trigger_payload=trigger_data)

    return {"status": "Workflow triggered and execution sequence completed."}

