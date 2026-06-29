from fastapi import FastAPI
from backend.database.database import engine, Base
from backend.database import models

Base.metadata.create_all(bind=engine)

app = FastAPI(
      title = "Workflow Automation Engine",
      description="A self hosted, local-first automation platform",
      version="1.0.0"
)

@app.get("/health")
def health_check():
      return {"status": "healthy", "engine": "running"}

