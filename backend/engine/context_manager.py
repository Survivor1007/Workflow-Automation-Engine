import copy
from typing import Dict, Any

class ContextManager:
    """
    The Context System functions as the universal in-memory shared bus 
    for an active execution pipeline run.
    """

    def __init__(self):
        self._context: Dict[str, Any] = {}

    def initialize(self, trigger_data: Dict[str, Any]) -> None: 
        """
        Seeds the root workflow context with the initial trigger payload
        """
        self._context["trigger"] = trigger_data
    
    def add_step_output(self, step_name: str, output: Dict[str, Any]) -> None:
        """
        Appends downstream action results under a unique sequence key.
        Enforces append-only behavior to prevent upstream data corruption.
        """
        if step_name in self._context:
            raise ValueError(f"Step namespace: '{step_name}' already exists. Context is append-only.")
        self._context[step_name] = output

    def get_context(self) -> Dict[str, Any]:
        """
        Returns a deep copy of the context.
        This ensures action providers cannot mutate the internal state by reference.
        """
        return copy.deepcopy(self._context)