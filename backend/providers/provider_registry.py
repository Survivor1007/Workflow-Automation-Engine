# ---
# File: backend/providers/provider_regsitry.py
# Function: Manage actions & triggers. Register core MVP components
# ---
from typing import Dict, Type

from backend.providers.actions.base_action import BaseAction
from backend.providers.triggers.base_trigger import BaseTrigger

from backend.providers.actions.http_action import HTTPRequestAction
from backend.providers.actions.discord_action import DiscordAction
from backend.providers.actions.logger_action import LoggerAction
from backend.providers.actions.formatter_action import TextFormatterAction
from backend.providers.triggers.webhook_trigger import WebhookTrigger
from backend.providers.triggers.cron_trigger import CronTrigger


class ProviderRegistry:
    """
    A centralized regsitry mapping string provider names from the database
    to their action Python class implementation.
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
            raise ValueError(f"Action Provider: `{name}` is not  registered in the system.")
        return cls._triggers[name]()
    
    # --- Bootstrapping ---
    @classmethod
    def register_core_providers(cls) -> None:
        """
        Registers all native providers. Call this once during application startup.
        """
        # Actions
        cls.register_action("LOGGER", LoggerAction)
        cls.register_action("TEXT_FORMATTER", TextFormatterAction)
        cls.register_action("HTTP_REQUEST", HTTPRequestAction)  
        cls.register_action("DISCORD", DiscordAction)
        
        # Triggers
        cls.register_trigger("WEBHOOK", WebhookTrigger)
        cls.register_trigger("CRON", CronTrigger)
    
    