import pytest
from unittest.mock import MagicMock, patch, ANY
from backend.engine.workflow_engine import WorkflowEngine, ProviderRegistry
from backend.providers.actions.base_action import BaseAction

@pytest.fixture
def mock_db():
    return MagicMock()

@pytest.fixture
def engine(mock_db):
    return WorkflowEngine(mock_db)

def test_render_step_config_recursive(engine):
    context = {"step_0": {"name": "Bob"}}
    config = {
        "message": "Hi {{ step_0.name }}",
        "nested_dict": {"key": "User is {{ step_0.name }}"},
        "mixed_list": ["static_value", "{{ step_0.name }}", 42],
        "number": 100
    }
    
    rendered = engine._render_step_config(config, context)
    
    assert rendered["message"] == "Hi Bob"
    assert rendered["nested_dict"]["key"] == "User is Bob"
    assert rendered["mixed_list"] == ["static_value", "Bob", 42]
    assert rendered["number"] == 100

@pytest.mark.asyncio
@patch("backend.engine.workflow_engine.ExecutionTracker")
@patch("backend.engine.workflow_engine.ContextManager")
async def test_execute_workflow_ignores_inactive(MockContextManager, MockTracker, engine, mock_db):
    # Setup a mock workflow that is inactive
    mock_workflow = MagicMock(is_active=False)
    mock_db.query().filter().first.return_value = mock_workflow

    await engine.execute_workflow(1, {"payload": "data"})
    
    # If inactive, the tracker should never be instantiated or called
    MockTracker.assert_not_called()

@pytest.mark.asyncio
@patch("backend.engine.workflow_engine.ExecutionTracker")
@patch("backend.engine.workflow_engine.ContextManager")
async def test_execute_workflow_fail_fast_enforcement(MockContextManager, MockTracker, engine, mock_db):
    # 1. Mock an active Workflow
    mock_workflow = MagicMock(is_active=True, id=1)
    mock_db.query().filter().first.return_value = mock_workflow

    # 2. Mock a single action step
    mock_step = MagicMock(id=10, step_order=1, step_type="ACTION", node_provider="MOCK_FAIL", config_json={})
    mock_db.query().filter().order_by().all.return_value = [mock_step]

    # 3. Create a fake provider that forces an error
    class FailingAction(BaseAction):
        async def execute(self, context):
            raise ValueError("Simulated Provider Failure")
    
    ProviderRegistry.register_action("MOCK_FAIL", FailingAction)

    # 4. Setup mock tracker instances
    mock_tracker_instance = MockTracker.return_value
    mock_exec_step = MagicMock()
    mock_tracker_instance.create_step.return_value = mock_exec_step

    # 5. Execute the engine
    await engine.execute_workflow(1, {"trigger": "data"})

    # 6. Assertions for Fail-Fast Architecture
    engine.db.rollback.assert_called_once()
    
    # Verify the step was explicitly marked as FAILED with the error message
    mock_tracker_instance.update_step_status.assert_called_with(
        mock_exec_step, 
        "FAILED", 
        error_message=ANY
    )
    
    # Verify the entire workflow run was marked as failed
    mock_tracker_instance.mark_failed.assert_called_once()