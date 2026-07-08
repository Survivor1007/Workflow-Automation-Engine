import pytest
import asyncio
from typing import Dict, Any

from backend.providers.base import BaseAction, ProviderMetadata, BaseStepConfig

class DummyConfig(BaseStepConfig):
    pass

class DummyAction(BaseAction):
    """A fake provider that we can control for testing policies."""
    metadata = ProviderMetadata(
        name="dummy", type="ACTION", display_name="Dummy", 
        version="1", category="Test", description="Test", icon="test"
    )
    config_model = DummyConfig

    def __init__(self):
        self.calls = 0

    async def execute(self, context: Dict[str, Any]) -> Dict[str, Any]:
        self.calls += 1
        
        # Simulate a timeout if sleep_time is provided
        if context.get("sleep_time", 0) > 0:
            await asyncio.sleep(context["sleep_time"])
            
        # Simulate a failure until we reach 'fail_times'
        if context.get("fail_times", 0) >= self.calls:
            raise ValueError("Simulated network failure")
            
        return {"status": "success"}

@pytest.mark.asyncio
async def test_policy_success_first_try():
    action = DummyAction()
    # 0 retries, 5s timeout
    context = {"config": {"retries": 0, "retry_delay": 0, "timeout": 5}}
    
    res = await action.run_with_policies(context)
    assert res["status"] == "success"
    assert action.calls == 1

@pytest.mark.asyncio
async def test_policy_recovers_after_retrying():
    action = DummyAction()
    # Fails on try 1, succeeds on try 2 (1 retry allowed)
    context = {"config": {"retries": 1, "retry_delay": 0, "timeout": 5}, "fail_times": 1}
    
    res = await action.run_with_policies(context)
    assert res["status"] == "success"
    assert action.calls == 2

@pytest.mark.asyncio
async def test_policy_exhausts_retries_and_fails():
    action = DummyAction()
    # Fails 5 times, but only 2 retries allowed
    context = {"config": {"retries": 2, "retry_delay": 0, "timeout": 5}, "fail_times": 5}
    
    with pytest.raises(ValueError, match="Simulated network failure"):
        await action.run_with_policies(context)
        
    assert action.calls == 3 # 1 initial try + 2 retries

@pytest.mark.asyncio
async def test_policy_enforces_timeout():
    action = DummyAction()
    # Action sleeps for 2s, but timeout is strictly 0.5s
    context = {"config": {"retries": 0, "retry_delay": 0, "timeout": 1}, "sleep_time": 2.0}
    
    with pytest.raises(ValueError, match="timed out after 1s"):
        await action.run_with_policies(context)