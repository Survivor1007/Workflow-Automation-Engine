
# Workflows: Variable Resolution

This document explains the runtime variable extraction pipeline and how the execution engine sandboxes evaluation syntax.

## The Shared Context Data Bus

During a workflow run execution, data passes from upstream modules to downstream providers using an internal, in-memory storage dictionary known as the **Context Object**. 


```

┌──────────────────────────────────────────────────────────┐
│             Shared Context Storage Bus                   │
├──────────────────────────────────────────────────────────┤
│ ┌──────────────────────────────────────────────────────┐ │
│ │ trigger: { "user": "sayan", "status": "failed" }    │ │◄── Placed by Trigger Step 0
│ └──────────────────────────────────────────────────────┘ │
│ ┌──────────────────────────────────────────────────────┐ │
│ │ step_1:  { "transformed_text": "Alert: sayan..." }   │ │◄── Appended by Action Step 1
│ └──────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────┘

```

Every action step registers its execution output dictionary directly into this central bus using its unique step name or sequence marker key. This lets downstream actions reference outputs generated earlier in the sequence.

---

## Variable Reference Expressions
Operators can inject upstream parameters dynamically into downstream configuration parameter text inputs using standard interpolation formatting:

```text
Alert: The operator {{ trigger.user }} reported a status of {{ trigger.status }}.

```

---

## Secure Variable Substitution Engine via Jinja2

To protect the local single-tenant application environment, the system strictly isolates variable compilation boundaries.

```text
[Raw Configuration Input] ──► [Jinja2 Sandbox Environment] ──► [Safe String Output]
                                      │
                   Blocks: ───────────┼──► __import__, eval(), exec()
                   Blocks: ───────────└──► Arbitrary Python Code

```

### 1. Sandboxed Sand Environments

The system intentionally avoids Python's built-in `eval()` functions, string compilation expressions, or arbitrary script executions. Variable interpolation is processed exclusively via Jinja2's targeted `SandboxedEnvironment` container module.

### 2. Runtime Isolation Guardrails

* **No Code Injection:** Jinja2 blocks operators from accessing hazardous internal python methods (such as `__subclasses__`, `__import__`, or `globals`) to prevent malicious input files from hijacking system console privileges.

* **Attribute Access Constraints:** Operators can extract data items nested inside the JSON Context dictionary block, but cannot access underlying application core modules, service layers, or live system database engines.

* **Explicit Determinism:** If an input string references an undefined or missing context key element, the parsing engine registers a variable validation error and halts processing safely.


