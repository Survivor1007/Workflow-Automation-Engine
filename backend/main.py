from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.database.database import engine, Base
from backend.database import models

# Import Engine & Providers
from backend.engine.workflow_engine import ProviderRegistry
from backend.providers.actions.formatter_action import TextFormatterAction
from backend.providers.actions.logger_action import LoggerAction

# Register the actions so the Engine knows how to execute them
ProviderRegistry.register_action("TEXT_FORMATTER", TextFormatterAction)
ProviderRegistry.register_action("LOGGER", LoggerAction)

# Import routers
from backend.api.routes import workflows
Base.metadata.create_all(bind=engine)

app = FastAPI(
      title = "Workflow Automation Engine",
      description="A self hosted, local-first automation platform",
      version="1.0.0"
)

# --- Add CORSMiddleware ---
app.add_middleware(
      CORSMiddleware,
      allow_origins=["*"],
      allow_credentials=True,
      allow_methods=["*"],
      allow_headers=["*"]
)

# --- Register the routers ---
app.include_router(workflows.router)


@app.get("/health")
def health_check():
      return {"status": "healthy", "engine": "running"}

if __name__ == "__main__":
      import uvicorn
      uvicorn.run("backend.main:app", host="0.0.0.0", port=8000, reload=True)

