import { Zap, Globe,  FileText, Clock, Terminal, MessageSquare } from "lucide-react";
import { useEditorStore } from "../../store/editorStore";

const AVAILABLE_PROVIDERS = [
  {
    category: "Triggers",
    items: [
      { id: "webhook_trigger", name: "Incoming Webhook", type: "trigger", icon: Zap, color: "text-amber-600 bg-amber-100" },
      { id: "cron_trigger", name: "Cron Scheduler", type: "trigger", icon: Clock, color: "text-amber-600 bg-amber-100" },
    ]
  },
  {
    category: "Actions",
    items: [
      { id: "discord_action", name: "Discord Webhook", type: "action", icon: MessageSquare, color: "text-blue-600 bg-blue-100" },
      { id: "http_request", name: "HTTP Request", type: "action", icon: Globe, color: "text-emerald-600 bg-green-100" },
      { id: "text_formatter", name: "Text Formatter", type: "action", icon: FileText, color: "text-zinc-600 bg-zinc-100" },
      { id: "logger_action", name: "System Logger", type: "action", icon: Terminal, color: "text-zinc-600 bg-zinc-100" },
    ]
  }
];

export function ProviderSelector() {
  const { addStep } = useEditorStore();

  const handleAddNode = (providerId: string, name: string, type: "trigger" | "action") => {
    addStep({
      provider_id: providerId,
      name: name,
      type: type,
      config: {} // Initialize with an empty config; the DynamicForm handles the rest
    });
  };

  return (
    <div className="flex flex-col h-full bg-white border-r border-zinc-200">
      <div className="p-4 border-b border-zinc-200 bg-zinc-50/50">
        <h3 className="text-sm font-semibold text-zinc-900">Available Nodes</h3>
        <p className="text-xs text-zinc-500 mt-1">Click to append to your workflow</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {AVAILABLE_PROVIDERS.map((group) => (
          <div key={group.category}>
            <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3">
              {group.category}
            </h4>
            <div className="space-y-2">
              {group.items.map((provider) => {
                const Icon = provider.icon;
                return (
                  <button
                    key={provider.id}
                    onClick={() => handleAddNode(provider.id, provider.name, provider.type as "trigger" | "action")}
                    className="flex items-center w-full p-2 rounded-md hover:bg-zinc-50 border border-transparent hover:border-zinc-200 transition-all group text-left"
                  >
                    <div className={`p-1.5 rounded-md mr-3 ${provider.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-zinc-900 truncate group-hover:text-blue-600 transition-colors">
                        {provider.name}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}