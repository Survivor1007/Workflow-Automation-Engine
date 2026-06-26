# Database: Entity-Relationship Diagram

This document models the persistent relational storage strategy optimized for local-first operations using an embedded SQLite engine.

## Relational Entity-Relationship Diagram

```mermaid
erDiagram
    WORKFLOWS {
        string id PK
        string name
        boolean is_active
        datetime created_at
        datetime updated_at
    }

    WORKFLOW_STEPS {
        string id PK
        string workflow_id FK
        int step_order
        string step_type
        string node_provider
        string config_json
    }

    WORKFLOW_EXECUTIONS {
        string id PK
        string workflow_id FK
        string status
        datetime started_at
        datetime completed_at
        string error_message 
    }

    WORKFLOW_EXECUTION_STEPS {
        string id PK
        string execution_id FK
        string step_id FK
        string status
        string input_payload
        string output_payload
        string error_message
    }

    WORKFLOWS ||--o{ WORKFLOW_STEPS : "defines sequential configuration"
    WORKFLOWS ||--o{ WORKFLOW_EXECUTIONS : "tracks history occurrences"
    WORKFLOW_EXECUTIONS ||--o{ WORKFLOW_EXECUTION_STEPS : "records step diagnostics"

```

---

## Schema Structural Design Rules

* **Enforced Linearity:** To minimize data footprint during structural changes, the database excludes complex pointer paths or parent node ID keys. Step order is managed by sequential integers (`step_order`).

* **Hybrid Storage Layout:** Core execution parameters (`status`, `workflow_id`) are stored as indexable relational columns for fast dashboard performance. Large string parameters and run traces are written to decoupled local JSONL files to keep the main `.db` database lightweight.
