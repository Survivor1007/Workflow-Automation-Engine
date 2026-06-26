# Implementation Roadmap

The Workflow Automation Engine will be built using an incremental feature delivery strategy. The primary goal is to prove the stability and security of the local-first execution engine before introducing complex UI features or advanced logic nodes.

## Phase 1: MVP (Version 1) - The Engine Core

**Focus:** Proving the engine, sequential execution, and local-first architecture.
* **Workflows:** Strictly linear execution paths. No loops, no branching logic, and no graph relationships (`parent_step_id` excluded).
* **Providers:** * *Triggers:* Webhook Trigger only.
  * *Actions:* Logger Action and Text Formatter Action].
* **UI:** Minimal workflow builder to configure triggers/actions, reorder steps, and view execution history.
* **Success Criteria:** The MVP is complete when a user can create a workflow, trigger it via a webhook, watch it execute sequentially, resolve Jinja2 variables correctly, and inspect the logged execution history.

---

## Phase 2: Expanding the Ecosystem (Version 2)

**Focus:** Increasing utility through additional core providers and an improved user experience.
* **New Triggers:** Cron Trigger (using APScheduler), File Trigger, Database Trigger.
* **New Actions:** Discord Webhooks, Slack Webhooks, Email execution, SQLite Inserts, and outbound HTTP Requests.
* **UI:** A better, more robust workflow builder experience.

---

## Phase 3: Advanced Logic (Version 3)

**Focus:** Breaking linearity and introducing complex workflow routing.
* **Workflow Model Updates:** Introduction of DAG (Directed Acyclic Graph) relationships in the database.
* **Logic Nodes:** Branching mechanisms, conditional evaluations (If/Else), and parallel execution paths.
* **UI:** Implementation of a visual DAG drag-and-drop builder to accommodate non-linear flows.

---

## Phase 4: Enterprise & Community features (Version 4)

**Focus:** Scaling the platform for team usage and third-party extension.
* **Access Control:** Multi-user support and role-based authentication.

---