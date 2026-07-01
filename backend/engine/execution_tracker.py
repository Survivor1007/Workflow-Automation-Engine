from sqlalchemy.orm import Session
from typing import Dict, Any
from datetime import datetime, timezone

from backend.database.models.workflow_execution import WorkflowExecution
from backend.database.models.workflow_execution_step import WorkflowExecutionStep

class ExecutionTracker:
    """
    Manages the persistence, logging and history of a workflow execution run.
    """
    def __init__(self, db: Session, workflow_id: int):
        self.db = db
        self.workflow_id = workflow_id
        self.execution_id = None

    def create_execution(self) -> WorkflowExecution:
        """ Initialize a new root execution record. """
        execution = WorkflowExecution(
            workflow_id = self.workflow_id,
            status = "RUNNING",
            started_at = datetime.now(timezone.utc)
        )                

        self.db.add(execution)
        self.db.commit()
        self.db.refresh(execution)
        self.execution_id = execution.id

        return execution
    
    def create_step(self, step_id: int, input_payload: Dict[str, Any]) -> WorkflowExecutionStep:
        """ Logs the start of an individual execution node. """
        step = WorkflowExecutionStep(
            execution_id = self.execution_id,
            step_id = step_id,
            status = "RUNNING",
            input_payload = input_payload
        )

        self.db.add(step)
        self.db.commit()
        self.db.refresh(step)

        return step

    def update_step_status(self, step_record: WorkflowExecutionStep, status: str, output_payload: Dict[str, Any] | None = None, error_message: str | None = None) -> None:
        """Updates a specific execution step with its final status and output."""
        step_record.status = status
        if output_payload is not None:
            step_record.output_payload = output_payload
        if error_message is not None:
            step_record.error_message = error_message
        self.db.commit()
    
    def mark_completed(self) -> None:
        """Marks the overall workflow execution as successfully completed."""
        if not self.execution_id:
            return
        
        execution = self.db.query(WorkflowExecution).filter(WorkflowExecution.id == self.execution_id).first()
        if execution:
            execution.status = "SUCCESS"
            execution.completed_at = datetime.now(timezone.utc)
            self.db.commit()

    def mark_failed(self, error_message: str) -> None:
        """Marks the overall workflow execution as failed and records the fatal error."""
        if not self.execution_id:
            return 
        
        execution = self.db.query(WorkflowExecution).filter(WorkflowExecution.id == self.execution_id).first()
        if execution:
            execution.status = "FAILED"
            execution.error_message = error_message
            execution.completed_at = datetime.now(timezone.utc)
            self.db.commit()