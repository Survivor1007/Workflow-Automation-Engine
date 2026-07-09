### **Frontend Design System & Tailwind Constraints**

#### **1. Design Philosophy**

* **Utilitarian over Decorative:** No gradients, no heavy drop shadows, no unnecessary animations.
* **Data Density:** Spacing should be compact. Admin tables and logs require high information density.
* **Semantic Feedback:** Colors are reserved almost entirely for system states (Running, Failed, Success, Warning).
* **Eye-Strain Reduction:** The background should not be blinding white. We will use a muted "Zinc" palette to soften the contrast for extended debugging sessions.

---

#### **2. Color Palette**

We will lock our UI into a strict subset of Tailwind's default colors.

**Base UI (Surfaces & Borders):**

* `bg-zinc-50` - Main application background.
* `bg-white` - Foreground panels (Cards, Dynamic Forms, Canvas).
* `border-zinc-200` - Standard borders for dividers and table rows.
* `text-zinc-900` - Primary high-contrast text (Headings).
* `text-zinc-500` - Secondary muted text (Helper text, timestamps).

**Semantic System States (The Engine Health):**

* **Success / Active:** `green-600` (e.g., Node completed, Workflow enabled)
* **Error / Failed:** `red-600` (e.g., Node crashed, Pipeline halted)
* **Warning / Retry:** `amber-500` (e.g., Step retrying, Timeout warning)
* **Info / Pending:** `blue-600` (e.g., Step queued, active selection state)
* **Inactive / Skipped:** `zinc-400` (e.g., Disabled workflow, skipped node)

---

#### **3. Typography**

Admin consoles should feel like native operating system applications. We will rely on system fonts to achieve zero layout shift and maximum performance.

* **Primary Font (`font-sans`):** `Inter`, or fallback to `system-ui`, `-apple-system`, `BlinkMacSystemFont`. Used for all general UI elements.
* **Monospace Font (`font-mono`):** `JetBrains Mono` or `ui-monospace`. **Crucial** for the execution `.jsonl` logs, JSON payloads, and Jinja2 `{{ variable }}` inputs.
* **Sizing:** We will lean heavily on `text-sm` (14px) and `text-xs` (12px) for tables and logs to maximize data density. `text-base` (16px) is reserved for standard form inputs.

---

#### **4. Component Standard Utilities**

To avoid bloated React components, we will establish standard utility chains for common UI elements.

* **Cards / Panels:**
`bg-white border border-zinc-200 rounded-lg shadow-sm`
* **Primary Buttons:**
`bg-zinc-900 text-white hover:bg-zinc-800 rounded-md px-3 py-1.5 text-sm font-medium transition-colors`
* **Secondary / Outline Buttons:**
`bg-white text-zinc-700 border border-zinc-200 hover:bg-zinc-50 rounded-md px-3 py-1.5 text-sm font-medium transition-colors`
* **Data Table Headers:**
`bg-zinc-50 text-zinc-500 text-xs font-semibold uppercase tracking-wider text-left px-4 py-2 border-b border-zinc-200`
* **Dynamic Form Inputs:**
`w-full border border-zinc-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`

---

#### **5. Execution Status Badges**

A core part of the UI is identifying what happened during a run. We will standardize these badges globally.

* **[ PENDING ]** : `bg-blue-50 text-blue-700 border-blue-200`
* **[ RUNNING ]** : `bg-amber-50 text-amber-700 border-amber-200 animate-pulse`
* **[ SUCCESS ]** : `bg-green-50 text-green-700 border-green-200`
* **[ FAILED  ]** : `bg-red-50 text-red-700 border-red-200`

---



