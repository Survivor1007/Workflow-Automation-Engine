# ---
# File: backend/engine/workflow_engine.py
# Function: Main orchestration area of the system
# ---
import time
import traceback
from sqlalchemy.orm import Session
from typing import  Dict, Any

from backend.core.logger import SystemLogger
from backend.database.models.workflow import Workflow
from backend.database.models.workflow_step import WorkflowStep
from backend.engine.context_manager import ContextManager
from backend.engine.template_renderer import TemplateRenderer
from backend.engine.execution_tracker import ExecutionTracker

from backend.providers.provider_registry import ProviderRegistry



class WorkflowEngine:
    """
    The main orchestrator loop. It sequences steps, isolates operational boundaries,
    manages execution transitions, and maintains the shared data bus.
    """
    def __init__(self, db: Session):
        self.db = db
        self.template_renderer = TemplateRenderer()

    def _render_step_config(self, config: Dict[str, Any], context: Dict[str, Any]) -> Dict[str, Any]:
        """
        Recursively traverses the step configuration JSON and resolves any Jinja2
        template strings using the current read-only context.
        """

        rendered_config = {}
        for key, value in config.items():
            if isinstance(value, str):
                rendered_config[key] = self.template_renderer.render(value, context)
            elif isinstance(value, dict):
                rendered_config[key] = self._render_step_config(value, context)
            elif isinstance(value, list):
                rendered_config[key] = [
                    self.template_renderer.render(item, context) if isinstance(item, str) else item 
                    for item in value
                ]
            else:
                rendered_config[key] = value
        return rendered_config
    
    async def execute_workflow(self, workflow_id: int, trigger_payload: Dict[str, Any]) -> None:
        """
        The primary runtime execution loop.
        """
        # 1. Verify Workflow exists and is active
        workflow = self.db.query(Workflow).filter(Workflow.id == workflow_id).first()
        if not workflow or not workflow.is_active:
            # We silently ignore inactive workflows per standard event-driven practices
            return

        # 2. Context Creation & Run Instantiation
        tracker = ExecutionTracker(self.db, workflow_id)
        tracker.create_execution()
        
        context_manager = ContextManager()
        context_manager.initialize(trigger_payload)

        # 3. Instantiation and Step Sort (Strictly ascending index values)
        steps = self.db.query(WorkflowStep).filter(WorkflowStep.workflow_id == workflow_id).order_by(WorkflowStep.step_order.asc()).all()

        if not steps:
            tracker.mark_completed()
            return

        # 4. Isolated Execution Steps Iteration
        for step in steps:
            exec_step = None
            try:
                # Resolve templated variables against current context state
                current_context = context_manager.get_context()
                rendered_config = self._render_step_config(step.config_json, current_context)
                
                # Log the start of this specific step
                exec_step = tracker.create_step(step.id, input_payload=rendered_config)

                output_payload = {}

                if step.step_order == 0 or step.step_type == "TRIGGER":
                    # The trigger event has already occurred to start this loop.
                    # We just record its configuration and output to the context bus.
                    output_payload = trigger_payload
                else:
                    # Resolve provider implementation and execute
                    action_provider = ProviderRegistry.get_action(step.node_provider)
                    
                    # Merge rendered config into context so the provider can access its specific settings
                    step_execution_context = {**current_context, "config": rendered_config}

                    # 1. Start Execution Time
                    start_time = time.time()

                    # 2. Call the wrapper, NOT execute() directly!
                    output_payload = await action_provider.run_with_policies(step_execution_context)

                    # 3. Calculate duration
                    duration_ms = round((time.time() - start_time) * 1000, 2)
                    
                    # 4. Log the success with metrics
                    SystemLogger.workflow("INFO", workflow_id, f"Step {step.step_order} ({step.node_provider}) completed.", metadata={"duration_ms": duration_ms})

                    # Append isolated step output to the universal data bus
                    context_manager.add_step_output(f"step_{step.step_order}", output_payload)

                # Mark step successful
                tracker.update_step_status(exec_step, "SUCCESS", output_payload=output_payload)

            except Exception as e:
                # 5. Fail-Fast Enforcement and No Silent Hiding
                self.db.rollback()
                
                error_details = f"{str(e)}\n{traceback.format_exc()}"

                SystemLogger.workflow("ERROR", workflow_id, f"Workflow failed at step {step.step_order}", metadata={"error": str(e)})
                SystemLogger.engine("ERROR", "Fail-fast abort triggered.", metadata={"workflow_id": workflow_id, "step_id": step.id})
                
                if exec_step:
                    tracker.update_step_status(exec_step, "FAILED", error_message=error_details)
                
                tracker.mark_failed(error_message=str(e))
                
                # Abandon downstream progress immediately
                return 

        # 6. Overall Success 
        tracker.mark_completed()