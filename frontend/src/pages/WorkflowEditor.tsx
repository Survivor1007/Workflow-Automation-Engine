import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useEditorStore } from "../store/editorStore";
import { ProviderSelector } from "../components/provider/ProviderSelector";
import { LinearCanvas } from "../components/workflow/LinearCanvas";
import { DynamicForm } from "../components/provider/DynamicForm";
import { Button } from "../components/common/Button";
import { ArrowLeft, Save, Play } from "lucide-react";
import { type ProviderSchema } from "../types/api";

// --- MOCK SCHEMAS ---
const mockSchemas: Record<string, ProviderSchema> = {
  "webhook_trigger": {
    provider_id: "webhook_trigger", name: "Incoming Webhook", type: "trigger",
    fields: [
      { name: "route_path", type: "string", title: "Endpoint Path", description: "The URL path for this webhook (e.g., /my-hook)", required: true },
    ]
  },
  "discord_action": {
    provider_id: "discord_action", name: "Discord Webhook", type: "action",
    fields: [
      { name: "webhook_url", type: "string", title: "Webhook URL", required: true },
      { name: "message", type: "textarea", title: "Message Payload", description: "Supports Jinja2 {{ variables }}.", required: true },
    ]
  },
  "logger_action": {
    provider_id: "logger_action", name: "System Logger", type: "action",
    fields: [
      { name: "log_level", type: "string", title: "Log Level", default: "INFO" },
      { name: "message", type: "string", title: "Message", description: "The text to write to engine.jsonl" }
    ]
  }
};

export default function WorkflowEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { initializeEditor, steps, selectedStepId } = useEditorStore();

  useEffect(() => {
    // Start with a totally empty canvas!
    initializeEditor(id || "new", []);
  }, [id, initializeEditor]);

  const activeStep = steps.find(s => s.id === selectedStepId);
  const activeSchema = activeStep ? mockSchemas[activeStep.provider_id] : null;

  return (
    <div className="flex flex-col h-full bg-zinc-50 overflow-hidden">
      {/* Editor Top Toolbar */}
      <header className="flex items-center justify-between px-6 h-14 bg-white border-b border-zinc-200 shrink-0">
        <div className="flex items-center">
          <button onClick={() => navigate("/workflows")} className="mr-4 text-zinc-400 hover:text-zinc-900 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-sm font-semibold text-zinc-900">Workflow Builder</h2>
            <p className="text-xs text-zinc-500">Draft Mode</p>
          </div>
        </div>
        <div className="flex space-x-3">
          <Button variant="secondary" size="sm">
            <Play className="w-4 h-4 mr-2 text-green-600" /> Test Run
          </Button>
          <Button variant="primary" size="sm">
            <Save className="w-4 h-4 mr-2" /> Save Pipeline
          </Button>
        </div>
      </header>

      {/* 3-Pane Layout */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* PANE 1: Provider Registry (Left) */}
        <div className="w-64 h-full shrink-0">
          <ProviderSelector />
        </div>

        {/* PANE 2: Linear Canvas (Center) */}
        <div className="flex-1 h-full overflow-y-auto bg-zinc-50/50">
          <LinearCanvas />
        </div>

        {/* PANE 3: Dynamic Config (Right) */}
        <div className="w-80 h-full bg-white border-l border-zinc-200 overflow-y-auto shrink-0 shadow-[-4px_0_15px_-3px_rgba(0,0,0,0.03)]">
          {selectedStepId && activeStep ? (
            <div className="p-6">
              <div className="mb-6 pb-4 border-b border-zinc-200">
                <h3 className="text-lg font-semibold text-zinc-900">{activeStep.name}</h3>
                <p className="text-xs text-zinc-500 mt-1">ID: {activeStep.provider_id}</p>
              </div>

              {activeSchema ? (
                <DynamicForm schema={activeSchema} stepId={selectedStepId} />
              ) : (
                <div className="text-sm text-amber-600 bg-amber-50 p-3 rounded border border-amber-200">
                  Schema not found. This provider has not defined a valid Pydantic configuration model.
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-zinc-400 text-sm p-8 text-center">
              Select a node on the canvas to configure its properties.
            </div>
          )}
        </div>

      </div>
    </div>
  );
}