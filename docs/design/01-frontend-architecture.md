### **Frontend Architecture Document**

**1. Core Philosophy**
The frontend of the Workflow Automation Engine is an operational administration console, not a consumer website. It is designed for speed, observability, and dynamic rendering. It contains zero business logic; it strictly consumes self-describing schemas from the backend and manages the visual state of workflow configurations.

**2. Technology Stack**

* **Build Tool:** Vite (Optimized for fast HMR and minimal overhead)
* **Framework:** React with TypeScript (Strict typing to mirror backend Pydantic models)
* **Styling:** Tailwind CSS (Utility-first, eliminating external CSS stylesheet bloat)
* **Server State:** TanStack Query (Data fetching, caching, and background synchronization)
* **Client State:** Zustand (Lightweight, un-opinionated local state for the workflow editor)
* **Routing:** React Router v6

---

### **3. Directory Structure**

To maintain symmetry with the backend, the frontend is strictly modularized by domain rather than file type.

```text
src/
├── app/               # Application entry point, global context providers, router config
├── assets/            # Static files, internal icons
├── components/        # UI components organized by domain
│   ├── common/        # Buttons, Modals, Badges, Table primitives
│   ├── execution/     # Timeline, Log viewer, Status indicators
│   ├── provider/      # DynamicForm, FieldRenderer, Input variants
│   └── workflow/      # WorkflowBuilder, LinearCanvas, StepCard
├── hooks/             # Custom React hooks (e.g., useDynamicSchema)
├── layouts/           # Page wrappers (e.g., DashboardLayout with Sidebar)
├── pages/             # Route-level components (Dashboard, Editor, Executions)
├── services/          # API layer encapsulating fetch/axios calls
├── store/             # Zustand stores (editorStore, uiStore)
├── styles/            # Global Tailwind directives
├── types/             # TypeScript interfaces mirroring Backend schemas
└── utils/             # Helper functions (schema parsing, date formatting)

```

---

### **4. Routing Architecture**

The application relies on a flat, intuitive routing structure designed for administrative speed.

* `/` **(Dashboard):** High-level system health, metrics, and aggregate execution data.
* `/workflows` **(Workflows Index):** Data table of all workflows, their active status, and triggers.
* `/workflows/:id` **(Workflow Editor):** The core configuration canvas (Split layout: Linear list on the left, configuration on the right).
* `/executions` **(Execution History):** Global log of all workflow runs across the system.
* `/executions/:id` **(Inspector):** Deep-dive trace of a specific run, displaying state, inputs, outputs, and errors per step.
* `/providers` **(Provider Registry):** Read-only catalog of all loaded triggers and actions.
* `/settings` **(System Settings):** Engine configuration and environment status.

---

### **5. State Management Boundaries**

We maintain a strict boundary between server data and local interface data to prevent rendering bottlenecks.

**Server State (TanStack Query):**
Owns everything that lives in the SQLite database.

* Fetching the list of workflows.
* Polling execution statuses.
* Fetching the JSON schemas from `GET /providers`.
* *Responsibility:* Caching, background refetching, and providing loading/error states to the UI automatically.

**Client State (Zustand):**
Owns the transient state of the Workflow Builder.

* The current sequence of `StepNodes` in the active canvas.
* Drag-and-drop reordering logic.
* Holding uncommitted form data in the `DynamicConfigPanel` before the user clicks "Save".
* *Responsibility:* Fast, synchronous updates to the UI without waiting for network requests.

---

### **6. Component Boundaries & Data Flow (The Dynamic UI)**

The most critical flow in the application is rendering the configuration panel without hardcoding forms. The data flows unidirectionally:

1. **Selection:** User clicks a "Discord Action" node in the `LinearCanvas`.
2. **Metadata Retrieval:** The `Editor` pulls the Discord JSON schema from the cached TanStack Query store (originally fetched from `/providers`).
3. **Schema Passing:** The schema is passed as a prop to the `DynamicForm` component.
4. **Field Rendering:** `DynamicForm` iterates over the schema's `fields` array and mounts the appropriate `FieldRenderer` (e.g., mapping type `string` to `TextField`, type `boolean` to `ToggleField`).
5. **State Mutation:** User input updates the Zustand store temporarily until the workflow is explicitly saved to the backend.

