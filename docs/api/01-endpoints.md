# API: REST Interface Endpoints

The API layer utilizes thin FastAPI routes. It focuses entirely on request validation, HTTP parameter serialization, and service boundary translation.

## Core API Endpoints

### 1. Webhook Receiver Router
Exposes incoming webhook ingestion entrypoints for external triggers.
* **`POST /api/v1/webhooks/{workflow_id}`**
  * **Description:** Receives event payloads from third-party systems. Identifies target workflows, confirms active registration status, and forwards execution handling to the core engine.

### 2. Workflow Management Interfaces
Handles CRUD interactions for workflow configurations.
* **`GET /api/v1/workflows`** — Returns an index list of configured engine components.
* **`POST /api/v1/workflows`** — Validates incoming configuration objects using Pydantic and stores them as a new workflow definition.
* **`GET /api/v1/workflows/{id}`** — Fetches detailed parameters and steps for a specific workflow ID.
* **`PUT /api/v1/workflows/{id}`** — Updates step configurations and active state values.
* **`DELETE /api/v1/workflows/{id}`** — Removes workflow configurations and step dependencies.

### 3. Execution Logs & Diagnostics
Powers the historical monitoring interface.
* **`GET /api/v1/executions`** — Fetches execution histories with filtering options for workflow IDs or status values.
* **`GET /api/v1/executions/{id}`** — Returns deep step-by-step payloads, execution timing, and error traces for specific pipeline runs.