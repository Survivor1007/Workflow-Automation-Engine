/*
File: /frontend/src/components/workflow/LinearCanvas.tsx
Function: This component reads the array of steps from Zustand and renders them with the vertical connection lines characteristic of ADR-001 (Linear Workflows).
*/
import { Plus } from "lucide-react";
import { useEditorStore } from "../../store/editorStore";
import { StepNode } from "./StepNode";

export function LinearCanvas() {
  const { steps, addStep } = useEditorStore();

  // Temporary mock function to add a step until we build the Provider Sidebar
  const handleAddMockStep = () => {
    addStep({
      provider_id: "http_request",
      name: "Outbound HTTP Action",
      type: "action",
      config: {}
    });
  };

  return (
    <div className="flex flex-col items-center py-8 space-y-2">
      {steps.length === 0 ? (
        <div className="text-sm text-zinc-500 text-center mt-10">
          No steps added yet.<br/> Start by adding a Trigger.
        </div>
      ) : (
        steps.map((step, index) => (
          <div key={step.id} className="flex flex-col items-center w-full">
            <StepNode step={step} index={index} />
            
            {/* The visual connector line between nodes */}
            {index < steps.length - 1 && (
              <div className="w-px h-8 bg-zinc-300 my-2"></div>
            )}
          </div>
        ))
      )}

      {/* Add Step Button */}
      <div className="pt-6">
        <button 
          onClick={handleAddMockStep}
          className="flex items-center px-4 py-2 text-sm font-medium text-zinc-600 bg-white border border-zinc-200 rounded-full hover:bg-zinc-50 hover:text-zinc-900 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4 mr-2" /> Add Step
        </button>
      </div>
    </div>
  );
}