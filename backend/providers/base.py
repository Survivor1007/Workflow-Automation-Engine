# ---
# File: backend/providers/base.py
# ---
import asyncio
from pydantic import Field, BaseModel
from typing import Dict, Type, Any, ClassVar
from abc import ABC, abstractmethod

from backend.core.logger import SystemLogger

class ProviderMetadata(BaseModel):
    name: str
    type: str # "ACTOIN" or "TRIGGER"
    display_name: str
    version: str
    category: str
    description: str
    icon: str

class BaseStepConfig(BaseModel):
    retries: int = Field(0, description="Number of times to retry on failure", ge=0, le=5)
    retry_delay: int = Field(2, description="Seconds to wait between retries", ge=0)
    timeout: int = Field(10, description="Maximum execution time in seconds", gt=0)

class BaseProvider(ABC):
    """The ultimate base class for all plugins (Actions and Triggers)."""
    # ClassVar ensure that these exist on the class itself, not just instances
    metadata: ClassVar[ProviderMetadata] # class-level info
    config_model: ClassVar[Type[BaseModel]] # Provider specific Schema

class BaseAction(BaseProvider):
    @abstractmethod
    async def execute(self, context: Dict[str, Any]) -> Dict[str, Any]:
        pass

    # The exection wrapper that enforces engine policies
    async def run_with_policies(self, context: Dict[str, Any]) -> Dict[str, Any]:
        """
        Wraps the execution in timeout and retry logic automatically.
        The Engine calls THIS method, not execute() directly.
        """
        raw_config = context.get("config", {})
        # Extract just the policy fields, ignoring provider-specific fields for a moment
        policies = BaseStepConfig(**raw_config)

        attempts = 0
        while attempts <= policies.retries:
            try:
                return await asyncio.wait_for(self.execute(context), timeout=policies.timeout)
            except asyncio.TimeoutError:
                SystemLogger.provider("ERROR", self.metadata.name, f"Execution timed out after {policies.timeout}s")
                raise ValueError(f"Provider '{self.metadata.name}' timed out after {policies.timeout}s")
            except Exception as e:
                attempts += 1
                if attempts > policies.retries:
                    SystemLogger.provider("ERROR", self.metadata.name, f"Failed after {attempts} attempts. Error: {str(e)}")
                    raise e # Fail-fast kicks in
                
                SystemLogger.provider("WARNING", self.metadata.name, f"Attempt {attempts} failed: {str(e)}. Retrying in {policies.retry_delay}s...")
                await asyncio.sleep(policies.retry_delay)


class BaseTrigger(BaseProvider):
    @abstractmethod
    async def execute(self, context: Dict[str, Any]) -> Dict[str, Any]:
        pass
