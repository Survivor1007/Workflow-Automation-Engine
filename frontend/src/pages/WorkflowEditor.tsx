import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useEditorStore } from "../store/editorStore";
import { LinearCanvas } from "../components/workflow/LinearCanvas";
import { DynamicForm } from "../components/provider/DynamicForm";
import { Button } from "../components/common/Button";
import { ArrowLeft, Save } from "lucide-react";
import { type ProviderSchema } from "../types/api";

// --- MOCK SCHEMAS (Simulating FastAPI GET /providers response) ---
const mockSchemas: Record<string, ProviderSchema> = {
  "webhook_trigger": {
    provider_id: "webhook_trigger",
    name: "Incoming Webhook",
    type: "trigger",
    fields: [
      { name: "route_path", type: "string", title: "Endpoint Path", description: "The URL path for this webhook (e.g., /my-hook)", required: true },
      { name: "require_auth", type: "boolean", title: "Require Authentication", default: false }
    ]
  },
  "discord_action": {
    provider_id: "discord_action",
    name: "Discord Webhook",
    type: "action",
    fields: [
      { name: "webhook_url", type: "string", title: "Webhook URL", description: "The destination Discord webhook URL.", required: true },
      { name: "message", type: "textarea", title: "Message Payload", description: "Supports Jinja2 {{ variables }} from the context.", required: true },
      { name: "retries", type: "integer", title: "Max Retries", default: 3 }
    ]
  }
};

export default function WorkflowEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { initializeEditor, steps, selectedStepId } = useEditorStore();

  useEffect(() => {
    // Initializing store with a mock pipeline
    initializeEditor(id || "new", [
      { id: "step_1", provider_id: "webhook_trigger", name: "Lead Capture", type: "trigger", config: {} },
      { id: "step_2", provider_id: "discord_action", name: "Notify Sales Team", type: "action", config: {} }
    ]);
  }, [id, initializeEditor]);

  // Determine the schema for the currently selected step
  const activeStep = steps.find(s => s.id === selectedStepId);
  const activeSchema = activeStep ? mockSchemas[activeStep.provider_id] : null;

  return (
    <div className="flex flex-col h-full bg-zinc-50 overflow-hidden">
      <header className="flex items-center justify-between px-6 h-14 bg-white border-b border-zinc-200 shrink-0">
        <div className="flex items-center">
          <button onClick={() => navigate("/workflows")} className="mr-4 text-zinc-400 hover:text-zinc-900 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-sm font-semibold text-zinc-900">Editing Workflow</h2>
            <p className="text-xs text-zinc-500">ID: {id}</p>
          </div>
        </div>
        <Button variant="primary" size="sm">
          <Save className="w-4 h-4 mr-2" /> Save Pipeline
        </Button>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Pane: Builder Canvas */}
        <div className="w-3/5 h-full overflow-y-auto border-r border-zinc-200 bg-zinc-50/50">
          <LinearCanvas />
        </div>

        {/* Right Pane: Dynamic Config */}
        <div className="w-2/5 h-full bg-white overflow-y-auto">
          {selectedStepId && activeStep ? (
            <div className="p-6">
              <div className="mb-6 pb-4 border-b border-zinc-200">
                <h3 className="text-lg font-semibold text-zinc-900">{activeStep.name}</h3>
                <p className="text-xs text-zinc-500 mt-1">Provider: {activeStep.provider_id}</p>
              </div>

              {activeSchema ? (
                <DynamicForm schema={activeSchema} stepId={selectedStepId} />
              ) : (
                <div className="text-sm text-amber-600 bg-amber-50 p-4 rounded-md border border-amber-200">
                  Schema not found for provider <strong>{activeStep.provider_id}</strong>.
                </div>
              )}
              
              {/* Dev Helper: See the Zustand state update in real-time */}
              <div className="mt-12 p-4 bg-zinc-900 rounded-md">
                <p className="text-xs font-semibold text-zinc-400 mb-2">LIVE ZUSTAND STATE (Debug):</p>
                <pre className="text-xs text-green-400 font-mono overflow-x-auto">
                  {JSON.stringify(activeStep.config, null, 2)}
                </pre>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-zinc-400 text-sm">
              Select a node to configure
            </div>
          )}
        </div>
      </div>
    </div>
  );
}