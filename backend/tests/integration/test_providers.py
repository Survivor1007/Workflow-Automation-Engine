# ---
# File: test_cases/test_providers.py 
# Function: Unit test for providers
# ---
import pytest
from unittest.mock import patch, AsyncMock, MagicMock

# Import providers
from backend.providers.actions.http_action import HTTPRequestAction
from backend.providers.actions.discord_action import DiscordAction
from backend.providers.triggers.cron_trigger import CronTrigger

# --- 1. HTTP Request Action Test ---
@pytest.mark.asyncio
@patch("backend.providers.actions.http_action.httpx.AsyncClient")
async def test_http_request_action_success(mock_client_class):
    # Setup Async context manager
    mock_client = AsyncMock()
    mock_client_class.return_value.__aenter__.return_value = mock_client

    # Setup simulated response
    mock_response = MagicMock()
    mock_response.status_code = 200
    mock_response.json.return_value = {"hello": "world"}
    mock_client.request.return_value = mock_response

    # Execute
    action = HTTPRequestAction()
    context = {
        "config": {
            "url": "https://api.example.com/data",
            "method": "POST",
            "payload": {"key": "value"}
        }
    }

    result = await action.execute(context)

    # Assertions
    assert result["status_code"] == 200
    assert result["response"] == {"hello": "world"}

    # Verify it made the correct network call under the hood
    mock_client.request.assert_called_once_with(
        method="POST",
        url="https://api.example.com/data",
        headers={},
        json={"key": "value"},
        params=None
    )

@pytest.mark.asyncio
async def test_http_request_action_missing_url():
    action = HTTPRequestAction()

    # Verify fail-fast constraint when misconfigured
    with pytest.raises(ValueError, match="Missing required 'url'"):
        await action.execute({"config": {}})
    

# --- Discord Action Test ---
@pytest.mark.asyncio
@patch("backend.providers.actions.discord_action.httpx.AsyncClient")
async def test_discord_action_success(mock_client_class):
    # 1. Setup Mock
    mock_client = AsyncMock()
    mock_client_class.return_value.__aenter__.return_value = mock_client
    
    mock_response = MagicMock()
    mock_response.status_code = 204  # Discord webhooks usually return 204 No Content
    mock_client.post.return_value = mock_response

    # 2. Execute
    action = DiscordAction()
    context = {
        "config": {
            "webhook_url": "https://discord.com/api/webhooks/123",
            "message": "Workflow Completed!",
            "username": "Custom Bot Name"
        }
    }
    
    result = await action.execute(context)

    # 3. Assertions
    assert result["status"] == "success"
    assert result["delivered_message"] == "Workflow Completed!"
    
    # Verify the exact payload shape sent to Discord matches their API requirements
    mock_client.post.assert_called_once_with(
        "https://discord.com/api/webhooks/123",
        json={
            "content": "Workflow Completed!",
            "username": "Custom Bot Name"
        }
    )

@pytest.mark.asyncio
async def test_discord_action_missing_config():
    action = DiscordAction()
    
    # Missing Message
    with pytest.raises(ValueError):
        await action.execute({"config": {"webhook_url": "http://url"}})
        
    # Missing URL
    with pytest.raises(ValueError):
        await action.execute({"config": {"message": "hello"}})


# --- Cron Trigger Test ---
@pytest.mark.asyncio
async def test_cron_trigger_passive_execution():
    """
    Ensures the dummy CronTrigger fulfills the BaseTrigger contract
    by simply passing the context forward.
    """
    trigger = CronTrigger()
    context = {
        "source": "cron_scheduler",
        "execution_time": "2026-07-04T12:00:00Z"
    }
    
    result = await trigger.execute(context)
    
    # Triggers should inject their context into the pipeline
    assert result == context


