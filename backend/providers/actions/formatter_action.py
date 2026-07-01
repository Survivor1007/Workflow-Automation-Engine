from typing import Dict, Any

from backend.providers.actions.base_action import BaseAction

class TextFormatterAction(BaseAction):
    """
    Action that takes a configuration string (which has already been safely rendered 
    by the core engine's Jinja2 sandbox) and exposes it to the context bus.
    """
    async def execute(self, context: Dict[str, Any]) -> Dict[str, Any]:
        # The engine merges the step's 'config_json' into the context under the 'config' key
        config = context.get("config", {})

        # Extract the rendered text 
        text = config.get("text", "")

        # Apply optional text transformations
        transform = config.get("transform", "none").lower()
        if transform == "uppercase":
            text = text.upper()
        elif transform == "lowercase":
            text = text.lower()

        # The returned dictionary is appended to the context bus for the downstream steps
        return {
            "formatter_text": text,
            "original_length": len(text)
        }

