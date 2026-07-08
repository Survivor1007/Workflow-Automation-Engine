import json
from unittest.mock import patch, mock_open

from backend.core.logger import SystemLogger

@patch("builtins.open", new_callable=mock_open)
def test_system_logger_engine(mock_file):
    # 1. Execute the logger
    SystemLogger.engine("INFO", "Engine started", {"version": "2.5"})
    
    # 2. Assert it attempted to open a file
    mock_file.assert_called_once()
    
    # 3. Extract the exact string it tried to write to the file
    write_calls = mock_file.return_value.write.call_args_list
    assert len(write_calls) == 1
    
    # 4. Parse the JSON and verify the structured format
    written_str = write_calls[0][0][0]
    data = json.loads(written_str)
    
    assert data["level"] == "INFO"
    assert data["source"] == "CORE_ENGINE"
    assert data["message"] == "Engine started"
    assert data["metadata"]["version"] == "2.5"
    assert "timestamp" in data