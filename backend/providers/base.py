from pydantic import Field, BaseModel
from typing import Dict, Type, Any, ClassVar
from abc import ABC, abstractmethod

class ProviderMetadata(BaseModel):
    name: str
    type: str # "ACTOIN" or "TRIGGER"
    display_name: str
    version: str
    category: str
    description: str
    icon: str

class BaseProvider(ABC):
    """The ultimate base class for all plugins (Actions and Triggers)."""
    # ClassVar ensure that these exist on the class itself, not just instances
    metadata: ClassVar[ProviderMetadata]
    config_model: ClassVar[Type[BaseModel]]

class BaseAction(BaseProvider):
    @abstractmethod
    async def execute(self, context: Dict[str, Any]) -> Dict[str, Any]:
        pass

class BaseTrigger(BaseProvider):
    @abstractmethod
    async def execute(self, context: Dict[str, Any]) -> Dict[str, Any]:
        pass
