# Workflows: Workflow Model

This document outlines the logical design and functional constraints of the workflow definition data structures within the platform.

## Architectural Design Constraint: Strict Linearity

Following the core product requirements for the MVP, the Workflow Automation Engine completely eliminates complex graph structures, branching operations (such as `if/else` nodes), or execution loopsWorkflows are modeled as a single, sequential pipeline:

```text
[Inbound Trigger] ──► [Sequential Action 1] ──► [Sequential Action 2] ──► [Sequential Action N]

```

By ensuring that step execution order relies solely on a strictly incremented sequence index, we avoid the database overhead of parent-child node pointers or Directed Acyclic Graph (DAG) depth-first traversal math.

---

## Component Modeling Definitions

### 1. The Workflow Entity

A wrapper container representing a distinct automation business pipeline.

* **`id`**: Unique primary identification string.

* **`name`**: A descriptive title provided by the human operator.

* **`is_active`**: A boolean flag indicating whether the engine's edge routers will process incoming event payloads targeting this workflow.



### 2. Workflow Steps (Nodes)

An individual execution block embedded directly inside a workflow chain.

* **`step_order`**: A sequence integer starting at `0`. The step matching `step_order = 0` is strictly reserved for the inbound event provider (**Trigger**). Downstream steps (`>= 1`) are executed in strictly ascending sequential order.


* **`step_type`**: Dictates the interface categorization (e.g., `TRIGGER` or `ACTION`).


* **`node_provider`**: Maps the step execution code to its designated system implementation plugin block (such as `WEBHOOK`, `LOGGER`, or `FORMATTER`).


* **`config_json`**: A flexible schema configuration column holding localized inputs, template definitions, and endpoint parameters necessary for provider logic.



---

## Data Validation and Verification Layers

Incoming mutation payload schemes are strongly parsed via Pydantic data schemas before touching storage operations or reaching model entities.

* **Integrity Validation:** Step sequences must present a continuous, gap-free progression (e.g., `[0, 1, 2]`). Duplicate `step_order` values within the same workflow context violate validation rules and are blocked.
* **Provider Safety Boundaries:** Pydantic checks verify that the declared `node_provider` exists inside the current engine registry. Unknown provider identifiers are rejected immediately at the API boundary.



```

