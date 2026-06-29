from sqlalchemy import Column, Integer, String, ForeignKey, JSON
from sqlalchemy.orm import relationship
from backend.database.database import Base

class WorkflowStep(Base):
    __tablename__ = "workflow_steps"

    id = Column(Integer, primary_key=True, index=True)
    workflow_id = Column(Integer, ForeignKey("workflows.id"), nullable=False)
    
    # Enforces strict linear execution (0 = Trigger, 1+ = Actions)
    step_order = Column(Integer, nullable=False)
    step_type = Column(String, nullable=False) 
    node_provider = Column(String, nullable=False) 
    config_json = Column(JSON, nullable=False, default={})

    workflow = relationship("Workflow", back_populates="steps")