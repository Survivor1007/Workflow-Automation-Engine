# ADR 004 : Automatic Provider Discovery & Plugin Architecture

**Status:** Accepted
**Date:** 2026-07-07

## Context
Currently, every new Action or Trigger added to the Workflow Automation Engine requires manual registration in the `ProviderRegistry`. As we expand the ecosystem (HTTP, Discord, Slack, Cron, etc.), this manual wiring creates friction, increases the risk of merge conflicts in the core engine files, and violates the Open/Closed Principle. 

Furthermore, moving to a mature platform (Version 2.5) requires providers to act as self-contained plugins that not only execute code but also define their own configuration schemas (via Pydantic) and UI metadata.

## Decision
We will shift to a **Dynamic Plugin Architecture** featuring Automatic Provider Discovery. 
1. The engine will dynamically scan the `backend/providers/actions` and `backend/providers/triggers` directories during the FastAPI startup lifecycle.
2. It will automatically load and register any valid class that inherits from `BaseProvider` (`BaseAction` / `BaseTrigger`).
3. Providers will be strictly required to expose `ProviderMetadata` and a `Pydantic` configuration schema to be considered valid plugins.

## Consequences


**Postive:**
* **True Plug-and-Play:** Adding a new integration simply requires dropping a new `.py` file into the providers folder. No core engine files need to be touched.
* **Dynamic UI:** The frontend can query the registry via a `GET /providers` endpoint to automatically generate configuration forms based on the Pydantic schemas.
* **Clean Architecture:** Strict decoupling between the execution engine and the provider implementations.

**Negative:**
* **Startup Overhead:** Dynamic module importing adds a negligible fraction of a second to application startup time.
* **Silent Failures:** If a provider has a syntax error or is missing required metadata, it might fail to load. We will mitigate this by implementing a robust logging and validation sequence during the discovery phase.