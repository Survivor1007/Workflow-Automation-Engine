import { useProviders } from "../hooks/useApi";
import { Card } from "../components/common/Card";
import { Zap, Settings as SettingsIcon, Terminal, Type, Box, Loader2, Server } from "lucide-react";

// Helper to map backend string icons to Lucide components
const getIcon = (iconName: string, type: "TRIGGER" | "ACTION") => {
  if (iconName === "terminal") return <Terminal className="w-5 h-5 text-zinc-700" />;
  if (iconName === "text-aa") return <Type className="w-5 h-5 text-blue-600" />;
  // Fallbacks
  return type === "TRIGGER" 
    ? <Zap className="w-5 h-5 text-amber-600" /> 
    : <SettingsIcon className="w-5 h-5 text-zinc-600" />;
};

export default function Providers() {
  const { data: providers, isLoading, isError } = useProviders();

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center h-full text-zinc-500 bg-zinc-50">
        <Loader2 className="w-8 h-8 animate-spin mb-4 text-zinc-400" />
        <p>Syncing provider registry from engine...</p>
      </div>
    );
  }

  if (isError || !providers) {
    return (
      <div className="p-8 text-center text-red-500">
        Failed to load providers. Ensure the backend is running.
      </div>
    );
  }

  const triggers = providers.filter(p => p.type === "TRIGGER");
  const actions = providers.filter(p => p.type === "ACTION");

  const renderProviderGrid = (items: typeof providers) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((provider) => (
        <Card key={provider.id} className="flex flex-col group hover:shadow-md transition-shadow border-zinc-200">
          <div className="p-5 flex-1">
            <div className="flex justify-between items-start mb-4">
              <div className={cn(
                "p-2.5 rounded-xl flex items-center justify-center",
                provider.type === "TRIGGER" ? "bg-amber-100" : "bg-zinc-100"
              )}>
                {getIcon(provider.metadata.icon, provider.type)}
              </div>
              <span className="inline-flex items-center px-2 py-1 rounded-full text-[10px] font-medium bg-zinc-100 text-zinc-600 border border-zinc-200">
                v{provider.metadata.version}
              </span>
            </div>
            <h3 className="text-base font-semibold text-zinc-900 group-hover:text-blue-600 transition-colors">
              {provider.metadata.display_name}
            </h3>
            <p className="text-sm text-zinc-500 mt-2 leading-relaxed">
              {provider.metadata.description}
            </p>
          </div>
          <div className="px-5 py-3 bg-zinc-50/80 border-t border-zinc-100 flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-500 flex items-center">
              <Box className="w-3.5 h-3.5 mr-1.5" /> {provider.metadata.category}
            </span>
            <span className="text-[10px] font-mono text-zinc-400">ID: {provider.id}</span>
          </div>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="flex-1 h-full overflow-y-auto p-8 bg-zinc-50">
      <div className="max-w-6xl mx-auto space-y-10">
        
        {/* Page Header */}
        <div className="flex items-center justify-between border-b border-zinc-200 pb-6">
          <div>
            <h1 className="text-2xl font-semibold text-zinc-900 tracking-tight flex items-center">
              <Server className="w-6 h-6 mr-3 text-zinc-400" />
              Provider Registry
            </h1>
            <p className="text-sm text-zinc-500 mt-2">
              Dynamically discovered modules currently loaded into the execution engine.
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-semibold text-zinc-900">{providers.length}</div>
            <div className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Total Loaded</div>
          </div>
        </div>

        {/* Triggers Section */}
        {triggers.length > 0 && (
          <section>
            <h2 className="text-lg font-semibold text-zinc-900 mb-4 flex items-center">
              <Zap className="w-5 h-5 mr-2 text-amber-500" /> Event Triggers
            </h2>
            {renderProviderGrid(triggers)}
          </section>
        )}

        {/* Actions Section */}
        {actions.length > 0 && (
          <section>
            <h2 className="text-lg font-semibold text-zinc-900 mb-4 flex items-center">
              <SettingsIcon className="w-5 h-5 mr-2 text-zinc-500" /> Execution Actions
            </h2>
            {renderProviderGrid(actions)}
          </section>
        )}

      </div>
    </div>
  );
}

// Ensure you have the cn utility imported if you use it (from step 5.2)
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}