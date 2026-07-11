/*
File : frontend/src/components/workflow/StepNode.tsx 
Function: This is the atomic visual representation of a single workflow step in our canvas.
*/

import { Trash2, Zap, Settings } from "lucide-react";
import { cn } from "../../utils/cn";
import { type WorkflowStep, useEditorStore } from "../../store/editorStore";

interface StepNodeProps {
  step: WorkflowStep;
  index: number;
}

export function StepNode({ step }: StepNodeProps) {
  const { selectedStepId, selectStep, removeStep } = useEditorStore();
  const isSelected = selectedStepId === step.id;

  return (
    <div 
      onClick={() => selectStep(step.id)}
      className={cn(
        "relative flex items-center w-full max-w-sm p-4 bg-white border rounded-lg cursor-pointer transition-all shadow-sm group",
        isSelected ? "border-blue-500 ring-1 ring-blue-500" : "border-zinc-200 hover:border-zinc-300"
      )}
    >
      {/* Node Index / Icon */}
      <div className={cn(
        "flex items-center justify-center w-8 h-8 rounded-md mr-4 shrink-0",
        step.type === "trigger" ? "bg-amber-100 text-amber-600" : "bg-zinc-100 text-zinc-600"
      )}>
        {step.type === "trigger" ? <Zap className="w-4 h-4" /> : <Settings className="w-4 h-4" />}
      </div>

      {/* Node Details */}
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-semibold text-zinc-900 truncate">{step.name}</h4>
        <p className="text-xs text-zinc-500 truncate">{step.provider_id}</p>
      </div>

      {/* Actions (Visible on Hover) */}
      <button 
        onClick={(e) => {
          e.stopPropagation(); // Prevent selecting the node when deleting
          removeStep(step.id);
        }}
        className="opacity-0 group-hover:opacity-100 p-2 text-zinc-400 hover:text-red-600 transition-opacity"
        title="Remove Step"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}