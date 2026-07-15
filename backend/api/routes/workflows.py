# ---
# File: backend/api/routes/workflows.py
# ---
from fastapi import Depends, HTTPException, APIRouter, Request, Query
from sqlalchemy.orm import Session
from typing import List

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

# --- To allow frontend to inspect what happened. Critical for achieving `Observability` ---

@router.get("/workflows/{workflow_id}/executions/")
def get_workflow_executions(workflow_id: int, db: Session = Depends(get_db)):
    """Fetch history of all runs for a specific workflow."""
    from backend.database.models.workflow_execution import WorkflowExecution
    executions = db.query(WorkflowExecution).filter(WorkflowExecution.workflow_id == workflow_id).all()
    return executions

@router.get("/executions/{execution_id}/steps/")
def get_execution_steps(execution_id: int, db: Session = Depends(get_db)):
    """Inspect detailed step results for a specific execution."""
    from backend.database.models.workflow_execution_step import WorkflowExecutionStep
    steps = db.query(WorkflowExecutionStep).filter(WorkflowExecutionStep.execution_id == execution_id).all()
    return steps

@router.get("/workflows/")
def get_workflows(db:Session = Depends(get_db)):
    """Fetch history of all workflows."""
    from backend.database.models.workflow import Workflow
    workflows = db.query(Workflow).all()
    return workflows

@router.get("/executions")
def get_executions(db: Session = Depends(get_db), limit: int = Query(default=10, lt=30)):
    """Fetch history of executions."""
    from backend.database.models.workflow_execution import WorkflowExecution
    executions = db.query(WorkflowExecution).limit(limit).all()
    return executions

@router.put("/workflows/{workflow_id}")
def update_workflow(workflow_id: int, workflow: WorkflowCreate, db: Session = Depends(get_db)):
    """Updates an existing workflow's name and active status."""
    db_workflow = db.query(Workflow).filter(Workflow.id == workflow_id).first()
    if not db_workflow:
        raise HTTPException(status_code=404, detail="Workflow not found")
    
    db_workflow.name = workflow.name
    db_workflow.is_active = workflow.is_active
    db.commit()
    db.refresh(db_workflow)
    return {"id": db_workflow.id, "name": db_workflow.name, "status": "updated"}

@router.put("/workflows/{workflow_id}/steps/")
def sync_workflow_steps(workflow_id: int, steps: List[StepCreate], db: Session = Depends(get_db)):
    """
    Bulk replaces all steps for a workflow. 
    This is used by the UI's 'Save Pipeline' feature to ensure transactional safety.
    """
    workflow = db.query(Workflow).filter(Workflow.id == workflow_id).first()
    if not workflow:
        raise HTTPException(status_code=404, detail="Workflow not found")
    
    # 1. Delete existing steps for this workflow
    db.query(WorkflowStep).filter(WorkflowStep.workflow_id == workflow_id).delete()
    
    # 2. Prepare the new steps
    new_steps = [
        WorkflowStep(
            workflow_id=workflow_id,
            step_order=step.step_order,
            step_type=step.step_type,
            node_provider=step.node_provider,
            config_json=step.config_json
        ) for step in steps
    ]
    
    # 3. Insert new steps and commit transactionally
    db.add_all(new_steps)
    db.commit()
    
    return {"status": "Steps synchronized successfully", "total_steps": len(new_steps)}