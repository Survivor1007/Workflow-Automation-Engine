/*
File: /frontend/src/pages/WorkflowEditor.tsx
Function: he left side handles the sequence layout, and the right side will eventually hold the DynamicConfigPanel
*/
import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useEditorStore } from "../store/editorStore";
import { LinearCanvas } from "../components/workflow/LinearCanvas";
import { Button } from "../components/common/Button";
import { ArrowLeft, Save } from "lucide-react";

export default function WorkflowEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { initializeEditor, selectedStepId } = useEditorStore();

  // On mount, we would normally fetch the workflow from TanStack Query
  // For now, we'll initialize the Zustand store with mock data.
  useEffect(() => {
    initializeEditor(id || "new", [
      { id: "1", provider_id: "webhook_trigger", name: "Incoming Webhook", type: "trigger", config: {} }
    ]);
  }, [id, initializeEditor]);

  return (
    <div className="flex flex-col h-full bg-zinc-50 overflow-hidden">
      
      {/* Editor Top Toolbar */}
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
        <div>
          <Button variant="primary" size="sm">
            <Save className="w-4 h-4 mr-2" /> Save Pipeline
          </Button>
        </div>
      </header>

      {/* Split Pane Layout */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* Left Pane: The Linear Builder Canvas */}
        <div className="w-3/5 h-full overflow-y-auto border-r border-zinc-200 bg-zinc-50/50">
          <LinearCanvas />
        </div>

        {/* Right Pane: Dynamic Configuration Panel */}
        <div className="w-2/5 h-full bg-white overflow-y-auto">
          {selectedStepId ? (
            <div className="p-6">
              <h3 className="text-lg font-medium text-zinc-900 border-b border-zinc-200 pb-3 mb-4">
                Configuration
              </h3>
              <p className="text-sm text-zinc-500">
                You have selected step ID: <code className="bg-zinc-100 px-1 py-0.5 rounded">{selectedStepId}</code>.
                <br/><br/>
                In the next step, we will inject the DynamicForm here, passing it the JSON schema fetched from your FastAPI backend!
              </p>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-zinc-400 text-sm">
              Select a node on the canvas to configure it.
            </div>
          )}
        </div>

      </div>
    </div>
  );
}