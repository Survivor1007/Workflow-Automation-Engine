from typing import Dict, Any
from jinja2.sandbox import SandboxedEnvironment

class TemplateRenderer:
    """
    Renders text configurations safely using Jinja2's SandboxedEnvironment.
    Prevents arbitrary code execution while allowing standard variable resolution.
    """
    def __init__(self):
        self._env = SandboxedEnvironment()

    def render(self, template_string: str, context: Dict[str, Any]) -> str:
        """
        Evaluates the template_string against the current read-only context.
         
        Example:
            render("Alert: {{ trigger.user }} failed" , {"trigger" : {"user" : "USER A"}}) 
            Returns -> Alert: USER A failed
        """

        if not template_string or not isinstance(template_string, str):
            return template_string
        
        template = self._env.from_string(template_string)
        return template.render(**context)
