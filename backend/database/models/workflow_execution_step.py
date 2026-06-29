from sqlalchemy import Column, Integer, String, ForeignKey, JSON
from sqlalchemy.orm import relationship
from backend.database.database import Base

class WorkflowExecutionStep(Base):
    __tablename__ = "workflow_execution_steps"

    id = Column(Integer, primary_key=True, index=True)
    execution_id = Column(Integer, ForeignKey("workflow_executions.id"), nullable=False)
    step_id = Column(Integer, ForeignKey("workflow_steps.id"), nullable=False)
    status = Column(String, nullable=False, default="PENDING")
    
    # Context payloads are stored directly for traceability
    input_payload = Column(JSON, nullable=True)
    output_payload = Column(JSON, nullable=True)
    error_message = Column(String, nullable=True)

    execution = relationship("WorkflowExecution", back_populates="execution_steps")