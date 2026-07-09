### **1. Atomic Components (`src/components/common/`)**

These are dumb, presentational components with no knowledge of the workflow engine.

* **`Button`**: Props: `variant` (primary, secondary, danger), `isLoading`, `onClick`.
* **`Badge`**: Props: `status` (PENDING, RUNNING, SUCCESS, FAILED). Encapsulates the color logic from our Design System.
* **`Card`**: A styled wrapper with consistent padding, border, and shadow. Used for the Workflow Builder steps and Dashboard metrics.
* **`Modal`**: Props: `isOpen`, `onClose`, `title`. For secondary actions like "Add New Workflow" or "View Log Details."
* **`FieldRenderer`**: The core atomic switch. It receives a `type` (string, boolean, number, textarea) and returns the corresponding HTML input element, styled with our design system rules.

---

### **2. Workflow Composite Components (`src/components/workflow/`)**

These manage the state and layout of the builder.

* **`WorkflowBuilder`**: The orchestrator. It holds the `Array` of steps in `Zustand` and provides the layout for the **Linear Canvas** (Left) and **Configuration Panel** (Right).
* **`StepNode`**: Represents a single step (e.g., "Discord Action"). Displays the icon, name, and a "Delete" / "Configure" button. Handles click events to trigger the **Configuration Panel**.
* **`LinearCanvas`**: A scrollable column that maps the `Zustand` step array into a sequence of `<StepNode />` components, joined by visual "connector" lines.

---

### **3. Dynamic Provider Components (`src/components/provider/`)**

These components are the "magic" of the Version 2.5 architecture. They do not know about "Discord" or "Webhook"—they only know JSON schemas.

* **`DynamicForm`**:
* **Input**: `schema` (JSON object from `GET /providers`), `initialData`.
* **Logic**: Iterates over the `fields` array in the schema.
* **Output**: Renders the form dynamically. When a field changes, it updates the `Zustand` store for the current step.


* **`ProviderSelector`**: A sidebar component that fetches the list of available providers (triggers and actions) and displays them as draggable or clickable cards.

---

### **4. Execution Components (`src/components/execution/`)**

These provide observability for the "Administration Console" perspective.

* **`ExecutionTimeline`**: A vertical list of steps.
* **Props**: `executionId`.
* **Logic**: Uses `TanStack Query` to fetch the status of each step. Displays success/fail badges, durations, and retry counts.


* **`LogViewer`**: A dedicated pane for viewing raw `.jsonl` output. It should be monospaced and handle log-level filtering (INFO, WARN, ERROR).
* **`ExecutionTable`**: A clean data table used in the Dashboard and Executions pages to list runs. Columns: `Timestamp`, `Workflow Name`, `Status`, `Duration`, `Actions (View)`.

---

### **Component Responsibility Summary**

| Component | Responsibility | State Dependency |
| --- | --- | --- |
| `DynamicForm` | Renders UI based on Pydantic JSON schemas. | Zustand (Form data) |
| `LinearCanvas` | Orchestrates the order of steps. | Zustand (Step order) |
| `ExecutionTimeline` | Observability & debugging history. | TanStack Query (API) |
| `FieldRenderer` | Raw input mapping (string, bool, etc). | None (Pure) |
| `WorkflowBuilder` | Master editor layout & coordination. | Zustand (Active flow) |

---
