# ---
# File: backend/services/scheduler_service.py
# ---
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.cron import CronTrigger
from sqlalchemy.orm import Session
from datetime import datetime, timezone

from backend.database.database import get_db_session
from backend.database.models.workflow import Workflow
from backend.database.models.workflow_step import WorkflowStep
from backend.engine.workflow_engine import WorkflowEngine
from backend.providers.provider_registry import ProviderRegistry
from backend.core.logger import SystemLogger

class SchedulerService:
    """
    Manages the lifecycle of cron-triggered  workflows using APScheduler.
    """
    _scheduler = AsyncIOScheduler()

    @classmethod
    def start(cls):
        """Starts the background scheduler."""
        if not cls._scheduler.running:
            cls._scheduler.start()
            SystemLogger.engine("INFO", "APScheduler Started.")
    
    @classmethod
    def shutdown(cls):
        """Gracefully shutdown the scheduler."""
        if cls._scheduler.running:
            cls._scheduler.shutdown()
            SystemLogger("INFO", "APScheduler shut down.")
    
    @staticmethod
    async def _execute_cron_workflow(workflow_id: int):
        """The actual job executed by the scheduler."""
        db: Session  = get_db_session()
        try:
            engine = WorkflowEngine(db)
            trigger_payload = {
                "source": "cron_scheduler",
                "execution_time": datetime.now(timezone.utc).isoformat()
            }
            await engine.execute_workflow(workflow_id, trigger_payload)
        except Exception as e:
             SystemLogger.engine("ERROR", f"Cron execution failed for workflow {workflow_id}: {str(e)}")
        finally:
            db.close()

    @classmethod
    def sync_jobs(cls):
        """
        Reads the database and schedules all active workflows that have a CRON trigger.
        """
        cls._scheduler.remove_all_jobs()
        db: Session = get_db_session()

        try:
            active_workflows = db.query(Workflow).filter(Workflow.is_active == True).all()

            count = 0
            for wf in active_workflows:
                trigger_step = db.query(WorkflowStep).filter(
                    WorkflowStep.workflow_id == wf.id,
                    WorkflowStep.step_type == "TRIGGER",
                    WorkflowStep.node_provider == "CRON"
                ).first()

                if trigger_step:
                    # Parse configuration using the Pydantic model
                    cron_provider = ProviderRegistry.get_trigger("CRON")

                    try:
                        # Validate the config JSON against the CronConfig schema
                        config = cron_provider.config_model(**trigger_step.config_json)
                        cls._scheduler.add_job(
                            cls._execute_cron_workflow,
                            CronTrigger.from_crontab(config.cron_expression),
                            args=[wf.id],
                            id=f"workflow_{wf.id}",
                            replace_existing=True
                        )
                        count += 1
                    except Exception as e:
                        SystemLogger.engine("ERROR", f"Failed to schedule workflow {wf.id} due to invalid cron config: {str(e)}")

            SystemLogger.engine("INFO", f"Scheduler synced. {count} active cron jobs loaded.")       

        finally:
            db.close()



