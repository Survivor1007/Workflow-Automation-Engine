# Database: SQLAlchemy Declarative Models

This document outlines the database models configured for the local SQLite engine using SQLAlchemy declarative schemas.

## Model Specifications

### 1. `Workflow` Model
Maps to the `workflows` table, serving as the root config container.
* **Fields:** `id` (String UUID), `name` (String), `is_active` (Boolean), alongside standard auto-updating timestamp fields.
* **Relationships:** Has a one-to-many relationship with `WorkflowStep` and `WorkflowExecution` instances.

### 2. `WorkflowStep` Model
Maps to the `workflow_steps` table, defining configuration states for individual execution nodes.
* **Fields:** `id` (String UUID), `workflow_id` (Foreign Key referencing workflows), `step_order` (Integer determining sequential index execution paths), `step_type` (String, e.g., `TRIGGER`/`ACTION`), `node_provider` (String, targeting plugins), and `config_json` (Text data mapped to hold flexible JSON configuration objects).

### 3. `WorkflowExecution` Model
Maps to the `workflow_executions` table, maintaining high-level history runs for the dashboard interface.
* **Fields:** `id` (String), `workflow_id` (Foreign Key), `status` (String Enum capturing state: `PENDING`, `RUNNING`, `SUCCESS`, `FAILED`), `started_at` (DateTime), `completed_at` (DateTime), and `error_message` (Nullable text capturing root engine collapse details).

### 4. `WorkflowExecutionStep` Model
Maps to the `workflow_execution_steps` table, preserving audit paths for debugging failures.
* **Fields:** `id` (String), `execution_id` (Foreign Key), `step_id` (Foreign Key referencing definitions), `status` (String step execution status), `input_payload` (Text), `output_payload` (Text), and `error_message` (Nullable text capturing explicit step crash details).
