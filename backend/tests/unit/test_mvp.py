import time
import requests

BASE_URL = "http://127.0.0.1:8000"

def run_test():
    print("1. Creating a new workflow")
    res = requests.post(f"{BASE_URL}/workflows/", json={"name": "MVP 2 Test Pipeline", "is_active": True })
    workflow_id  = res.json()["id"]
    print(f"  -> Workflow created with ID: {workflow_id}\n")

    print("2. Adding Webhook trigger (Step 0) ...")
    requests.post(f"{BASE_URL}/workflows/{workflow_id}/steps/", json={
        "step_order": 0,
        "step_type": "TRIGGER",
        "node_provider": "WEBHOOK",
        "config_json": {}
    })

    print("3. Adding Text Formatter Action (Step 1)...")
    requests.post(f"{BASE_URL}/workflows/{workflow_id}/steps/", json={
        "step_order": 1,
        "step_type": "ACTION",
        "node_provider": "TEXT_FORMATTER",
        "config_json": {
            "text": "Alert: The user {{ trigger.body.user_name }} has just purchased {{ trigger.body.item }}!",
            "transform": "uppercase"
        }
    })

    print("4. Adding Logger Action (Step 2)...")
    requests.post(f"{BASE_URL}/workflows/{workflow_id}/steps/", json={
        "step_order": 2,
        "step_type": "ACTION",
        "node_provider": "LOGGER",
        "config_json": {
            "level": "INFO",
            "message": "Engine Output: {{ step_1.formatted_text}}",
            "include_context": True,
        }
    })

    print("5. Firing the webhook to start execution!\n")
    trigger_payload = {
        "user_name": "USER-A",
        "item": "A mechanical keyboard"
    }

    res = requests.post(f"{BASE_URL}/webhook/{workflow_id}", json=trigger_payload)
    # print(f"Server Response: {res.status_code}\n")
    # print(f"Server Response: {res.text}\n")

    print(f"Server Response: {res.json()}\n")

    print("Test Complete! Check your `local logs/provider.jsonl` file")


if __name__ == "__main__":
    run_test()