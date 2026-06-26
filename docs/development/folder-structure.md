# Folder Structure

This document defines the physical directory layout of the self-hosted environment. The structure enforces our service-layer pattern and cleanly separates the presentation layer from the execution engine.

## Backend Directory Structure

```text
backend/
├── api/                        # Interface Layer
│   └── routes/                 # Thin routing blocks (REST endpoints & Webhook entries)
├── services/                   # Application Service Layer (Business rules, Workflow CRUD)
├── engine/                     # Core Orchestration Domain
│   ├── workflow_engine.py      # Main pipeline sequencer and loop controller
│   ├── context_manager.py      # Isolated shared execution data context manager
│   ├── template_renderer.py    # Safe variable substitution via Jinja2 sandboxing
│   └── execution_tracker.py    # Runtime execution status and DB metrics persistency
├── providers/                  # Extensible Integration Module
│   ├── triggers/               # Inbound event contracts and definitions
│   │   ├── base_trigger.py     # Trigger base class contract
│   │   └── webhook_trigger.py  # Webhook payload parser implementation
│   └── actions/                # Outbound transformation and storage steps
│       ├── base_action.py      # Action base class contract
│       ├── logger_action.py    # Execution monitoring/debugging output node
│       └── formatter_action.py # String template variable injector
├── database/                   # Persistence Layer
│   ├── models/                 # SQLAlchemy structural data definitions
│   └── schemas/                # Pydantic data verification contracts
├── core/                       # Global engine setup (Configuration variables, constants)
├── workers/                    # Background task processors and schedulers
├── logs/                       # Target directory for local JSONL files
├── tests/                      # Unit and integration test suites
└── main.py                     # App entry point initializing FastAPI runtime
```