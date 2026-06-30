from abc import ABC, abstractmethod
from typing import Dict, Any

class BaseTrigger(ABC):
    """
    Abstract base class for all workflow triggers.
    Triggers are responsible for initiating pipelines and producing the root data payload.
    """
    
    @abstractmethod
    async def execute(self, **kwargs) -> Dict[str, Any]:
        """
        Listens for or parses an external environment boundary event.
        
        Returns:
            dict: A payload that seeds the root workflow context under the 'trigger' key.
        """
        pass