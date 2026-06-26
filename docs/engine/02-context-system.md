# Engine: Context System

The Context System functions as the universal in-memory shared data bus for an active execution pipeline run.

## Data Bus Architecture

Because workflows run sequentially without complex branching logic , data flows downward by maintaining an isolated dictionary object that updates at every step:

```text
 Inbound Action Event Payload
             │
             ▼
 ┌────────────────────────────────────────────────────────┐
 │ Context Storage Bus                                    │
 ├────────────────────────────────────────────────────────┤
 │                                                        │
 │ ┌────────────────────────────────────────────────────┐ │
 │ │ trigger: { "user": "sayan", "status": "failed" }   │ │ ◄── Written by Webhook Trigger
 │ └────────────────────────────────────────────────────┘ │
 │                                                        │
 │ ┌────────────────────────────────────────────────────┐ │
 │ │ step_1:  { "transformed_text": "Alert: sayan..." } │ │ ◄── Appended by Formatter Action
 │ └────────────────────────────────────────────────────┘ │
 └────────────────────────────────────────────────────────┘

```

---

## Context Mutability and Isolation Guardrails

To prevent data corruption during execution runs, the context system implements strict usage boundaries:

* **Isolated Run State:** Every pipeline execution maintains its own dedicated context instance dictionary. There is no persistent shared memory across concurrent workflow instances, eliminating cross-talk and memory corruption risks.

* **Append-Only Behavior:** Downstream actions can read from any previous step's output namespace , but they are restricted from altering keys written by upstream providers. Step modules append their results under their unique sequence key or name tag.

* **Traceable Immutability:** Tracking historical input and output snapshots side-by-side allows developers to easily inspect execution results and debug step mutations directly from the management interface.
