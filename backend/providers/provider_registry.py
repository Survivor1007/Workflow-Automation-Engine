# ---
# File: backend/providers/provider_regsitry.py
# Function: Manage actions & triggers. Register core MVP components
# ---
import inspect
import importlib
import pkgutil
from typing import Dict, Type

from backend.providers.base import BaseAction, BaseTrigger

class ProviderRegistry:
    """
    A centralized regsitry mapping string provider names from the database
    to their action Python class implementation. Now with Automatic Discovery.
    """
    _actions: Dict[str, Type[BaseAction]] = {}
    _triggers: Dict[str, Type[BaseTrigger]] = {}

    # --- Actions ---
    @classmethod
    def register_action(cls, name: str, action_class: Type[BaseAction]) -> None:
        cls._actions[name] = action_class
    
    @classmethod
    def get_action(cls, name:str) -> BaseAction:
        if name not in cls._actions:
            raise ValueError(f"Action Provider: `{name}` is not  registered in the system.")
        return cls._actions[name]()

    # --- Triggers ---
    @classmethod
    def register_trigger(cls, name: str, trigger_class: Type[BaseTrigger]) -> None:
        cls._triggers[name] = trigger_class
    
    @classmethod
    def get_trigger(cls, name:str) -> BaseTrigger:
        if name not in cls._triggers:
            raise ValueError(f"Trigger Provider: `{name}` is not  registered in the system.")
        return cls._triggers[name]()
    

    @classmethod
    def discover_and_register(cls) -> None:
        """
        Dynamically crawls the backend.providers module.
        Find any class inheriting from BaseAction or Basetrigger and registers it.
        """
        # The root package to scan
        package_name = "backend.providers"

        # Dynamically import the package
        package = importlib.import_module(package_name)

        # Walk through all submodules (actions/, triggers/, etc.)
        for _, module_name, _ in pkgutil.walk_packages(package.__path__, package.__name__ + "."):
            try:
                module = importlib.import_module(module_name)

                # Inspect all members of the module
                for name, obj in inspect.getmembers(module, inspect.isclass):
                    # We only care about concrete classes (not ABCs) defined in THIS module
                    if obj.__module__ == module_name and not inspect.isabstract(obj):
                        
                        # Is it an Action?
                        if issubclass(obj, BaseAction) and hasattr(obj, 'metadata'):
                            cls.register_action(obj.metadata.name.upper(), obj)
                            print(f"Discovered Action: {obj.metadata.name.upper()} -> {name}")
                        
                        # Is it a Trigger?
                        elif issubclass(obj, BaseTrigger) and hasattr(obj, 'metadata'):
                            cls.register_trigger(obj.metadata.name.upper(), obj)
                            print(f"Discovered Trigger: {obj.metadata.name.upper()} -> {name}")

            except Exception as e:
                print(f"Warning: Failed to import module {module_name}. Error: {e}")

    @classmethod
    def get_all_metadata(cls) -> list:
        """
        Returns a JSON-serializable list of all registered providers, 
        including their UI metadata and Pydantic configuration schemas.
        """
        providers = []
        
        # Helper to extract metadata
        def extract_info(registry_dict, type_label):
            for name, provider_class in registry_dict.items():
                if hasattr(provider_class, 'metadata') and hasattr(provider_class, 'config_model'):
                    providers.append({
                        "id": name,
                        "type": type_label,
                        "metadata": provider_class.metadata.model_dump(),
                        "ui_schema": provider_class.config_model.model_json_schema()
                    })

        extract_info(cls._actions, "ACTION")
        extract_info(cls._triggers, "TRIGGER")
        
        return providers
    
    