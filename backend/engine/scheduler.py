# ---
# File: backend/engine/scheduler.py
# Function: A centralized service to read your database, find all active workflows with a CRON trigger, and schedule them.
# ---
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.cron import CronTrigger
from sqlalchemy.orm import Session
from datetime import datetime, timezone

from backend.database.database import get_db_session
from backend.database.models.workflow import Workflow
from backend.database.models.workflow_step import WorkflowStep
from backend.engine.workflow_engine import WorkflowEngine

# Global scheduler instance
scheduler = AsyncIOScheduler()

async def _execute_cron_workflow(workflow_id: int):
    """The background task that actually fires the task."""
    db: Session = get_db_session()
    try:
        engine  =  WorkflowEngine(db)

        trigger_payload  = {
            "source": "cron_scheduler",
            "execution_time": datetime.now(timezone.utc).isoformat()
        }

        await engine.execute_workflow(workflow_id=workflow_id, trigger_payload=trigger_payload)
    finally:
        db.close()

def sync_scheduler():
    """
    Reads the database and schedules all active CRON workflows.
    Call this on startup, and whenever a workflow is updated/saved.
    """

    scheduler.remove_all_jobs()
    db: Session = get_db_session()
    try:
        active_workflows = db.query(Workflow).filter(Workflow.is_active == True).all()

        for wf in active_workflows:
            trigger_step = db.query(WorkflowStep).filter(
                WorkflowStep.workflow_id == wf.id,
                WorkflowStep.step_type == "TRIGGER",
                WorkflowStep.node_provider == "CRON"
            ).first()

            if trigger_step:
                    cron_expr = trigger_step.config_json.get("cron_expression")
                    if cron_expr:
                        # Parse standard cron (e.g., "*/5 * * * *" for every 5 mins)
                        scheduler.add_job(
                            _execute_cron_workflow,
                            CronTrigger.from_crontab(cron_expr),
                            args=[wf.id],
                            id=f"workflow_{wf.id}",
                            replace_existing=True
                        )
                        print(f"Scheduled Workflow {wf.id} with CRON: {cron_expr}")
    finally:
        db.close()
