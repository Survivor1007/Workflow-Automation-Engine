import pytest
from jinja2.exceptions import SecurityError
from backend.engine.template_renderer import TemplateRenderer

@pytest.fixture
def renderer():
    return TemplateRenderer()

def test_render_valid_string(renderer):
    context = {"trigger": {"body": {"user_name": "Alice", "item": "Keyboard"}}}
    template = "Alert: The user {{ trigger.body.user_name }} purchased a {{ trigger.body.item }}."
    
    result = renderer.render(template, context)
    assert result == "Alert: The user Alice purchased a Keyboard."

def test_render_empty_or_invalid_input(renderer):
    # Should safely return the input if it's not a valid string
    assert renderer.render(None, {}) is None
    assert renderer.render("", {}) == ""
    assert renderer.render(123, {}) == 123 

def test_render_missing_variable(renderer):
    # Jinja defaults to resolving missing variables as empty strings
    context = {"trigger": {}}
    template = "Value: {{ trigger.missing_key }}"
    
    result = renderer.render(template, context)
    assert result == "Value: "

def test_sandbox_security_blocks_dunder_methods(renderer):
    # Proves the SandboxedEnvironment blocks access to Python internals
    context = {"user": "Alice"}
    # Attempting to access base classes to execute arbitrary code
    malicious_template = "{{ user.__class__.__bases__[0].__subclasses__() }}"
    
    with pytest.raises(SecurityError):
        renderer.render(malicious_template, context)