from typing import Dict, Any
from pydantic import Field, BaseModel

from backend.providers.base import BaseAction, ProviderMetadata

class TextFormatterConfig(BaseModel):
    text: str = Field(..., description="The text to format. Jinja2 templating allowed.")
    tranform: str = Field("uppercase", description="Transformation type: 'uppercase', 'lowercase' or 'capitalize' ")


class TextFormatterAction(BaseAction):
    """
    Action that takes a configuration string (which has already been safely rendered 
    by the core engine's Jinja2 sandbox) and exposes it to the context bus.
    """

    metadata = ProviderMetadata(
        name="text_formatter",
        type="ACTION",
        display_name="Text Formatter",
        version="1.0",
        category="Utility",
        description="Format text strings (uppercase, lowercase, capitalize).",
        icon="text-aa"
    )
    config_model = TextFormatterConfig

    async def execute(self, context: Dict[str, Any]) -> Dict[str, Any]:
        # The engine merges the step's 'config_json' into the context under the 'config' key
        config = self.config_model(**context.get("config", {}))

        # Extract the rendered text 
        text = config.get("text", "")

        # Apply optional text transformations
        transform = config.get("transform", "none").lower()

        if transform == "uppercase":
            formatted_text = text.upper()
        elif transform == "lowercase":
            formatted_text = text.lower()
        elif transform == "capitalize":
            formatted_text = text.capitalize()
        else:
            formatted_text = text

        # The returned dictionary is appended to the context bus for the downstream steps
        return {
            "original_text": text,
            "formatted_text": formatted_text,
            "original_length": len(text),
            "transform_applied": transform
        }

