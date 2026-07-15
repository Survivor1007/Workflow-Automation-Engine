import { Zap, Settings, Loader2 } from "lucide-react";
import { useEditorStore } from "../../store/editorStore";
import { useProviders } from "../../hooks/useApi";

export function ProviderSelector() {
  const { addStep } = useEditorStore();
  const { data: providers, isLoading, isError } = useProviders();

  const handleAddNode = (providerId: string, name: string, type: "TRIGGER" | "ACTION") => {
    // Note: mapping to lowercase "trigger" | "action" to match our internal Zustand state type
    addStep({ provider_id: providerId, name, type: type.toLowerCase() as "trigger" | "action", config: {} });
  };

  if (isLoading) {
    return <div className="p-4 text-sm text-zinc-500 flex items-center"><Loader2 className="animate-spin mr-2 w-4 h-4"/> Loading Providers...</div>;
  }

  if (isError || !providers) {
    return <div className="p-4 text-sm text-red-500">Failed to load providers from engine.</div>;
  }

  const triggers = providers.filter(p => p.type === "TRIGGER");
  const actions = providers.filter(p => p.type === "ACTION");

  return (
    <div className="flex flex-col h-full bg-white border-r border-zinc-200">
      <div className="p-4 border-b border-zinc-200 bg-zinc-50/50">
        <h3 className="text-sm font-semibold text-zinc-900">Available Nodes</h3>
        <p className="text-xs text-zinc-500 mt-1">Fetched live from backend</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        
        {/* Render Triggers */}
        {triggers.length > 0 && (
          <div>
            <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3">Triggers</h4>
            <div className="space-y-2">
              {triggers.map((provider) => (
                <button key={provider.id} onClick={() => handleAddNode(provider.id, provider.metadata.display_name, provider.type)} className="flex items-center w-full p-2 rounded-md hover:bg-zinc-50 border border-transparent hover:border-zinc-200 transition-all group text-left">
                  <div className="p-1.5 rounded-md mr-3 text-amber-600 bg-amber-100"><Zap className="w-4 h-4" /></div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-zinc-900 truncate group-hover:text-blue-600 transition-colors">{provider.metadata.display_name}</div>
                    <div className="text-[10px] text-zinc-400 truncate mt-0.5">{provider.metadata.description}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Render Actions */}
        {actions.length > 0 && (
          <div>
            <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3">Actions</h4>
            <div className="space-y-2">
              {actions.map((provider) => (
                <button key={provider.id} onClick={() => handleAddNode(provider.id, provider.metadata.display_name, provider.type)} className="flex items-center w-full p-2 rounded-md hover:bg-zinc-50 border border-transparent hover:border-zinc-200 transition-all group text-left">
                  <div className="p-1.5 rounded-md mr-3 text-zinc-600 bg-zinc-100"><Settings className="w-4 h-4" /></div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-zinc-900 truncate group-hover:text-blue-600 transition-colors">{provider.metadata.display_name}</div>
                    <div className="text-[10px] text-zinc-400 truncate mt-0.5">{provider.metadata.description}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}