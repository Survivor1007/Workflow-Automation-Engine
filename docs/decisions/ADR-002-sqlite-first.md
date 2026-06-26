# ADR 002: Local-First Storage with SQLite

**Status:** Accepted  
**Date:** 2026-06-26  

## Context
The project vision is to build a self-hosted, local-first automation platform that prioritizes privacy and eliminates recurring automation costs. Many organizations require processing to stay inside their own infrastructure, particularly when handling sensitive data like financial records or proprietary code. Imposing a heavy dependency—such as requiring a standalone PostgreSQL or Redis cluster—increases the barrier to entry and violates the lightweight ethos of the platform.

## Decision
The core database will use SQLite initially, managed via SQLAlchemy. All relational configurations (workflows, step schemas, run statuses) will be stored in a local `.db` file on the host machine.

## Consequences
**Positive:**
* **Zero External Dependencies:** Users can pull the repository and run the engine immediately without orchestrating external database containers.
* **Data Sovereignty:** All processing is kept inside the user's infrastructure, ensuring complete control over data and execution.
* **No Network Latency:** In-process database calls resolve instantaneously compared to network round-trips.

**Negative:**
* **Concurrency Limits:** SQLite handles heavy concurrent writes poorly. 
* **Mitigation Strategy:** To protect database longevity, we are decoupling massive text strings. Detailed context traces and payload logs will be written to line-delimited `JSONL` text streams instead of the relational database.