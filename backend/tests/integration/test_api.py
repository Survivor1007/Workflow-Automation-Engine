import pytest
from fastapi import FastAPI
from fastapi.testclient import TestClient
from unittest.mock import patch

# Import just the router to isolate the test
from backend.api.routes.workflows import router

# Create a dummy app and mount the router
app = FastAPI()
app.include_router(router)
client = TestClient(app)

@patch("backend.api.routes.workflows.ProviderRegistry.get_all_metadata")
def test_get_providers_route(mock_get_metadata):
    # 1. Setup the mock response
    mock_payload = [
        {"id": "DISCORD", "type": "ACTION", "metadata": {"name": "discord"}}
    ]
    mock_get_metadata.return_value = mock_payload

    # 2. Make the simulated HTTP request
    response = client.get("/providers")

    # 3. Assertions
    assert response.status_code == 200
    assert response.json() == mock_payload
    mock_get_metadata.assert_called_once()