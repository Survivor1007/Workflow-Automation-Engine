from abc import ABC, abstractmethod
from typing import Dict, Any

class BaseAction(ABC):
    """
    Abstract base class for all workflow actions.
    Actions accept the current context object, run data mutations, and return step updates.
    """
    
    @abstractmethod
    async def execute(self, context: Dict[str, Any]) -> Dict[str, Any]:
        """
        Executes business logic using the current shared data context.
        
        Args:
            context (dict): The accumulated workflow state (including trigger data and previous step outputs).
            
        Returns:
            dict: A dictionary containing step-specific results to append to the context.
        """
        pass