# ADR 001: Strict Linear Workflows for MVP

**Status:** Accepted  
**Date:** 2026-06-26  

## Context
Standard automation platforms (like Zapier or n8n) often allow for complex graph structures, branching logic (if/else), and loops. While powerful, these structures require Directed Acyclic Graph (DAG) traversal algorithms and complex relational database pointers to track parent-child node relationships. The objective for the MVP is to prove the core execution engine and maintain architectural simplicity.

## Decision
We will restrict the Workflow Automation Engine to strictly sequential, linear execution pipelines. 
* We will not implement graph relationships or branching logic initially. 
* We will exclude `parent_step_id` from the database schema.
* Step execution order will be determined purely by a continuous integer sequence (`step_order`). 

## Consequences
**Positive:**
* **Schema Simplicity:** Eliminates the need for recursive database queries to reconstruct workflows.
* **Predictable Execution:** The runtime loop simply iterates through an array sorted by ascending index values, reducing the risk of infinite loops or deadlocks.
* **Frontend Velocity:** Only a minimal workflow builder UI needs to exist. Building a list-based UI is significantly faster and less error-prone than building a drag-and-drop canvas.

**Negative:**
* **Reduced Flexibility:** Users cannot build parallel execution paths or conditional branches (e.g., routing failures to a different action). These features are deferred to Version 3.