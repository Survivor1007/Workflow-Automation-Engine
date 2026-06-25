# Documentation Map: Workflow Automation Engine

Welcome to the architectural documentation for the **Workflow Automation Engine**, a self-hosted, local-first automation platform designed for event-driven pipelines.

Use this map to navigate the implementation, engineering decisions, and system blueprints.

---

## 🗺️ Documentation Directory

### 🏗️ 1. Architecture & Core Blueprints
* [01-System-Context](architecture/01-system-context.md) — The system's relationship to users and external entities.
* [02-High-Level Architecture](architecture/02-high-level-architecture.md) — Global data flow through the presentation, API, and core runtime layers.
* [03-Container Diagram](architecture/03-container-diagram.md) — High-level deployment and technical runtime environments.
* [04-Backend Architecture](architecture/04-backend-architecture.md) — Granular breakdown of services, directories, and boundaries.

### 🔄 2. Workflow Logic & State
* [01-Workflow Model](workflows/01-workflow-model.md) — Definitions of triggers, actions, and sequential constraints.
* [02-Workflow Execution Flow](workflows/02-workflow-execution-flow.md) — State-machine transitions for operational execution instances.
* [03-Variable Resolution](workflows/03-variable-resolution.md) — Safe evaluation context using Jinja2 templates.

### ⚙️ 3. Execution Engine & Plugins
* [01-Workflow Engine](engine/01-workflow-engine.md) — Orchestration loops, execution dispatching, and run boundaries.
* [02-Context System](engine/02-context-system.md) — In-memory state shared across individual workflow steps.
* [03-Provider Architecture](engine/03-provider-architecture.md) — Extensible plugin contracts for Triggers and Actions.

### 📊 4. Storage & Interface Layers
* [01-ER Diagram](database/01-er-diagram.md) — Conceptual and logical relational model for persistent tracking.
* [02-Models](database/02-models.md) — Declarative schemas mapped via SQLAlchemy.
* [01-Endpoints](api/01-endpoints.md) — Rest API endpoints exposed for workflow composition and tracking.

### 📝 5. Architecture Decision Records (ADRs)
* [ADR-001: Strict Linear Workflows](decisions/ADR-001-linear-workflows.md)
* [ADR-002: Local-First Storage with SQLite](decisions/ADR-002-sqlite-first.md)
* [ADR-003: Safe Templating via Jinja2](decisions/ADR-003-jinja2-templating.md)

---

## 🎨 System Diagrams Source
Raw Mermaid definitions are tracked independently within the `diagrams/` folder for easier iterative updates:
* [System Context Schema](diagrams/system-context.md)
* [High-Level Architecture Schema](diagrams/high-level-architecture.md)
* [Execution Sequence Schema](diagrams/workflow-execution-sequence.md)
* [Entity-Relationship Schema](diagrams/er-diagram.md)