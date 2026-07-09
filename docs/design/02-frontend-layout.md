
### **1. The Global App Shell (Base Layout)**

Every page shares this outer wrapper. It provides immediate access to navigation and a global indicator of engine health.

```text
+-------------------------------------------------------------------------+
| ⚙️ Workflow Automation Engine                [🟢 System Health: Online] |
+---------------+---------------------------------------------------------+
| NAVIGATION    |                                                         |
|               |                                                         |
| 📊 Dashboard  |                     <PAGE CONTENT>                      |
| 🔄 Workflows  |                                                         |
| ⚡ Executions |                                                         |
| 🔌 Providers  |                                                         |
| ⚙️ Settings   |                                                         |
|               |                                                         |
|               |                                                         |
| v2.5.0        |                                                         |
+---------------+---------------------------------------------------------+

```

---

### **2. The Dashboard (`/`)**

The goal is answering: "Is my automation system healthy right now?"

```text
+-------------------------------------------------------------------------+
| Dashboard                                                               |
|                                                                         |
|  [ Total Workflows: 12 ]    [ Active: 8 ]    [ Disabled: 4 ]            |
|  [ Executions (24h): 1,402 ] [ Success Rate: 98.2% ] [ Failures: 24 ]   |
|                                                                         |
| --- Recent Failures --------------------------------------------------- |
| Discord Alerts   | Step: Webhook Action  | 10 mins ago   | [ Inspect ]  |
| Daily Backup     | Step: HTTP Request    | 2 hours ago   | [ Inspect ]  |
|                                                                         |
| --- System Log Stream (engine.jsonl) ---------------------------------- |
| [11:42:01] INFO  - Engine initialized successfully                      |
| [11:45:22] WARN  - Retry triggered on Workflow #4 (Discord)             |
| [11:46:01] ERROR - Connection timeout on external HTTP provider         |
+-------------------------------------------------------------------------+

```

---

### **3. The Workflows List (`/workflows`)**

A standard, actionable data table. No cards, just a clean operational grid.

```text
+-------------------------------------------------------------------------+
| Workflows                                               [+ New Workflow]|
|                                                                         |
| Name             | Trigger    | Steps | Status   | Last Run   | Actions |
|------------------+------------+-------+----------+------------+---------|
| Daily Backup     | Cron       |   5   | (Toggle) | 2 min ago  | [ Edit ]|
| Discord Alerts   | Webhook    |   3   | (Toggle) | 1 hour ago | [ Edit ]|
| Lead Sync        | Webhook    |   4   | (Toggle) | 2 days ago | [ Edit ]|
| Sync CRM         | Scheduler  |   2   | (Toggle) | Never      | [ Edit ]|
+-------------------------------------------------------------------------+

```

---

### **4. The Workflow Editor (`/workflows/:id`)**

The heart of the application. As we discussed, for Version 2.5, this is a clean 2-pane layout (Linear Pipeline on the left, Dynamic Configuration on the right).

```text
+-------------------------------------------------------------------------+
| [← Back]  Editing: Discord Alerts                         [ Save Flow ] |
+-----------------------------+-------------------------------------------+
| Pipeline (Linear)           | Configuration: Discord Action             |
|                             |                                           |
| +-------------------------+ | --- Step Metadata ----------------------- |
| | [⚡] Webhook Trigger    | | Step Name:   [ Notify Team            ] |
| +-------------------------+ | Retry Count: [ 3                      ] |
|             ↓               | Timeout (s): [ 30                     ] |
| +-------------------------+ |                                           |
| | [📝] Text Formatter     | | --- Provider Schema (Dynamic) --------- |
| +-------------------------+ |                                           |
|             ↓               | Webhook URL:                              |
| +-------------------------+ | [ https://discord.com/api/webhooks/... ]  |
| | [💬] Discord Action  ◀| |                                           |
| +-------------------------+ | Message Body (Supports {{ Jinja2 }}):     |
|             ↓               | +---------------------------------------+ |
| +-------------------------+ | | Alert! New user: {{ trigger.name }}   | |
| | [📋] Logger             | | |                                       | |
| +-------------------------+ | +---------------------------------------+ |
|                             |                                           |
|    [(+) Add Step]           |                           [ Apply Edits ] |
+-----------------------------+-------------------------------------------+

```

---

### **5. The Execution Inspector (`/executions/:id`)**

Used strictly for debugging a specific run. The timeline sits on the left, and selecting a node reveals exactly what the engine saw at that millisecond.

```text
+-------------------------------------------------------------------------+
| [← Back]  Execution #8902 (Failed)                [ Duration: 1.2s ]    |
+-----------------------------+-------------------------------------------+
| Execution Timeline          | Step Results: Discord Action              |
|                             |                                           |
| [🟢] Webhook (80ms)         | Status: 🔴 FAILED (Provider Timeout)      |
|             ↓               |                                           |
| [🟢] Text Formatter (12ms)  | --- Resolved Input Context ---            |
|             ↓               | {                                         |
| [🔴] Discord (1100ms)    ◀|   "webhook_url": "https://...",           |
|             ↓               |   "message": "Alert! New user: Alice"     |
| [⚫] Logger (Skipped)       | }                                         |
|                             |                                           |
|                             | --- Engine Logs & Output ---              |
|                             | [ERROR] Connection refused by Discord API.|
|                             | [TRACE] urllib3.exceptions.TimeoutError   |
|                             |         Max retries exceeded (3/3).       |
+-----------------------------+-------------------------------------------+

```

---

### **6. Provider Registry (`/providers`)**

A read-only visualization of the `GET /providers` endpoint, proving that the system auto-discovered your backend Python plugins.

```text
+-------------------------------------------------------------------------+
| Installed Providers                                                     |
|                                                                         |
| --- Triggers ---------------------------------------------------------- |
| [⚡] Webhook   (v1.0) - Listens for incoming HTTP POST payloads.        |
| [⏱️] Cron      (v1.0) - Schedules workflows based on cron syntax.       |
|                                                                         |
| --- Actions ----------------------------------------------------------- |
| [📝] Formatter (v1.1) - Injects {{ variables }} into text templates.    |
| [💬] Discord   (v1.0) - Sends messages to Discord channels.             |
| [🌐] HTTP      (v1.0) - Fires generic outbound HTTP REST requests.      |
| [📋] Logger    (v1.0) - Writes formatted states to system .jsonl logs.  |
+-------------------------------------------------------------------------+

```
