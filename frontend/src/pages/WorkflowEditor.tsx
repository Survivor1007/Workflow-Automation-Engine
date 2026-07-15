import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useEditorStore } from "../store/editorStore";
import { ProviderSelector } from "../components/provider/ProviderSelector";
import { LinearCanvas } from "../components/workflow/LinearCanvas";
import { DynamicForm } from "../components/provider/DynamicForm";
import { Button } from "../components/common/Button";
import { ArrowLeft, Save, Play, Loader2 } from "lucide-react";
import { useProviders, useSaveWorkflow } from "../hooks/useApi";

export default function WorkflowEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { initializeEditor, steps, selectedStepId } = useEditorStore();
  
  // Real API hooks
  const { data: providerSchemas } = useProviders();
  const saveMutation = useSaveWorkflow();

  useEffect(() => {
    // If we had a GET /workflows/:id endpoint, we would fetch it here.
    // For now, initializing empty.
    initializeEditor(id || "new", []);
  }, [id, initializeEditor]);

  const activeStep = steps.find(s => s.id === selectedStepId);
  // Match using the provider.id from the real backend
  const activeSchema = activeStep && providerSchemas 
    ? providerSchemas.find(p => p.id === activeStep.provider_id) 
    : null;

  const handleSave = () => {
    const payload = {
      name: "New Automated Pipeline",
      is_active: true,
      steps: steps.map((step, index) => ({
        step_order: index,
        provider_id: step.provider_id,
        config: step.config
      }))
    };

    saveMutation.mutate(
      { id: id || "new", payload },
      {
        onSuccess: (data) => {
          alert("Workflow saved to database!");
          if (id === "new" && data.id) navigate(`/workflows/${data.id}`);
        },
        onError: (err) => {
          console.error(err);
          alert("Error saving workflow");
        }
      }
    );
  };

  return (
    <div className="flex flex-col h-full bg-zinc-50 overflow-hidden">
      <header className="flex items-center justify-between px-6 h-14 bg-white border-b border-zinc-200 shrink-0">
        <div className="flex items-center">
          <button onClick={() => navigate("/workflows")} className="mr-4 text-zinc-400 hover:text-zinc-900 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-sm font-semibold text-zinc-900">Workflow Builder</h2>
            <p className="text-xs text-zinc-500">Live Editor</p>
          </div>
        </div>
        <div className="flex space-x-3">
          <Button variant="secondary" size="sm">
            <Play className="w-4 h-4 mr-2 text-green-600" /> Test Run
          </Button>
          <Button variant="primary" size="sm" onClick={handleSave} disabled={saveMutation.isPending}>
            {saveMutation.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
            {saveMutation.isPending ? "Saving..." : "Save Pipeline"}
          </Button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <div className="w-64 h-full shrink-0">
          <ProviderSelector />
        </div>

        <div className="flex-1 h-full overflow-y-auto bg-zinc-50/50">
          <LinearCanvas />
        </div>

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
                  Loading schema...
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