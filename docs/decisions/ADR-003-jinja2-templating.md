# ADR 003: Safe Templating via Jinja2

**Status:** Accepted  
**Date:** 2026-06-26  

## Context
In any workflow pipeline, users must be able to reference previous outputs. This requires dynamic variable resolution (e.g., dynamically injecting `{{ trigger.user }}` into a text formatting action). However, evaluating arbitrary text configurations introduces massive security vulnerabilities if malicious operators attempt to execute internal code snippets or access host system resources.

## Decision
The system will render templates safely using Jinja2. We will rely specifically on its sandboxed execution environment. 
* We will never execute Python code directly from user input.
* We will never evaluate arbitrary expressions using built-in methods like `eval()`. 
* Only safe variable substitution mapping to the read-only execution context bus is permitted.

## Consequences
**Positive:**
* **Security:** Hardens the execution node against code injection attacks.
* **Familiar Syntax:** Jinja2 uses a widely recognized double-bracket `{{ }}` syntax that operators will intuitively understand.

**Negative:**
* **Stringent Parsing:** If a user attempts complex data manipulation inside a configuration string (like sorting a dictionary), Jinja2 will block it. All heavy transformations must instead be handled by dedicated Action Provider plugins, enforcing the separation of configuration and execution logic.