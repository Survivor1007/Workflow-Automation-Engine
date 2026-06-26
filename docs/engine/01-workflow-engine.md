# Engine: Workflow Engine

The `WorkflowEngine` acts as the core controller of the platform, orchestrating sequential step loops, establishing execution safety boundaries, and recording runtime metric lifecycles.

## Core Orchestration Responsibilities

The engine acts purely as an orchestrator. It remains entirely decoupled from concrete task behaviors, interacting exclusively with abstract trigger and action interfaces.

```text
[Engine Router Event]
       │
       ▼
 1. Load Workflow Definition (from Database)
       │
       ▼
 2. Initialize Execution Run Instance Record (Set PENDING/RUNNING)
       │
       ▼
 3. Instatiate In-Memory Shared Context Bus
       │
       ▼
 4. Run Sequential Loop (Step 0 to Step N)
       │  ├── Render variables via Sandbox Renderer
       │  └── Dispatch execution block to Provider Method
       │
       ▼
 5. Finalize State Metrics & Emit Local File JSONL Append Logs

```

---

## Execution Run Loop Logic

When an event matches an active workflow target, the execution engine coordinates the following operations:

1. **Instantiation and Step Sort:** The engine fetches the active pipeline structure, ordering the execution array strictly by ascending index values (`step_order`).

2. **Context Creation:** It initializes an execution record tracking object and binds a new in-memory `ContextManager` block to isolate the run.

3. **Step Iteration:** For every action entry sequentially mapped, the engine handles rendering parameters, hands the execution context off to the step provider, and writes state transitions.

---

## Execution Boundary Protections

To guarantee structural stability on a single-tenant host machine, the orchestration loop implements strict crash containment strategies:

* **Fail-Fast Enforcement:** If an unhandled exception or third-party interaction timeout surfaces within any step, the run loop stops immediately, marks the execution as `FAILED`, and abandons downstream progress.

* **No Silent Hiding:** Every failure captures full contextual diagnostics—including raw text error traces and state variables—which are preserved across database indexes and local JSONL text output streams.

