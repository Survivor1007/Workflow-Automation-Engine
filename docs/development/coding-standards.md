# Coding Standards & Architecture Philosophy

This document outlines the core engineering principles, architectural patterns, and coding standards for the Workflow Automation Engine. The project prioritizes engineering quality, maintainability, and clean architecture over feature count.

## Architectural Principles

1. **Modular Architecture:** The system is strictly decoupled, ensuring components do not bleed into one another.
2. **Service-Layer Pattern:** Business logic is encapsulated in the service layer, keeping API routes thin and focused strictly on HTTP transport.
3. **Plugin-Based Workflow Providers:** All core functionality (triggers and actions) must be implemented through extensible provider contracts.
4. **Configuration-Driven Design:** Execution paths are determined by data configuration, not hardcoded logic.
5. **Incremental Feature Delivery:** Build and prove the core engine first before building advanced UI components.

## Backend Standards (Python / FastAPI)

* **Tech Stack:** Python 3.11+, FastAPI, SQLAlchemy, Pydantic, and Jinja2.
* **Strong Typing:** All functions, methods, and API routes must use strict Python type hints.
* **Thin API Routes:** Routes should only handle request validation and response formatting. All heavy lifting belongs in the engine or service layers.
* **Decoupled Engine:** The execution engine must never know the implementation details of individual providers; it only orchestrates execution.
* **Error Handling:** Never silently ignore failures. A failed step must immediately stop downstream execution, mark the run as `FAILED`, and record error details.

## Frontend Standards (React / TypeScript)

* **Tech Stack:** React, TypeScript, Vite, and Tailwind CSS.
* **Role:** The UI exists primarily to configure and visualize workflows.
* **Simplicity:** The MVP should feature a minimal workflow builder UI without complex drag-and-drop canvases or DAG editors.

## Logging Strategy

* **Format:** Use structured JSONL logging.
* **Structure:** Log entries must follow the format: `{ "timestamp": "...", "level": "...", "source": "...", "message": "..." }`.
* **Storage:** Logs must be isolated into specialized files: `workflow.jsonl`, `engine.jsonl`, and `providers.jsonl`.

--- 

## Naming Conventions

Classes          -> PascalCase
Functions        -> snake_case
Variables        -> snake_case
Constants        -> UPPER_SNAKE_CASE
Files            -> snake_case.py
Database Tables  -> plural_snake_case
API Routes       -> kebab-case or plural nouns

---

## Import Order

# Standard Library
from datetime import datetime

# Third Party
from fastapi import APIRouter

# Local Imports
from backend.services.workflow_service import WorkflowService