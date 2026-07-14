// ---
// File: frontend/src/components/execution/ExecutionTimeline.tsx
// Function: This component renders the left pane. It lists every step that ran (or attempted to run) and highlights the currently selected step for debugging.
// ---

import { CheckCircle2, XCircle, Clock, AlertCircle } from "lucide-react";
import { cn } from "../../utils/cn";
import { type StepExecutionTrace } from "../../types/api";

interface ExecutionTimelineProps {
  steps: StepExecutionTrace[];
  selectedStepId: string | null;
  onSelectStep: (id: string) => void;
}

export function ExecutionTimeline({ steps, selectedStepId, onSelectStep }: ExecutionTimelineProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "SUCCESS": return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case "FAILED": return <XCircle className="w-5 h-5 text-red-500" />;
      case "RUNNING": return <Clock className="w-5 h-5 text-amber-500 animate-pulse" />;
      default: return <AlertCircle className="w-5 h-5 text-zinc-400" />;
    }
  };

  return (
    <div className="p-4 space-y-3">
      {steps.map((step, index) => {
        const isSelected = selectedStepId === step.step_id;
        
        return (
          <div key={step.step_id} className="relative">
            {/* Visual connector line */}
            {index < steps.length - 1 && (
              <div className="absolute top-10 left-5 w-px h-6 bg-zinc-200"></div>
            )}
            
            <button
              onClick={() => onSelectStep(step.step_id)}
              className={cn(
                "flex items-center w-full p-3 rounded-lg border text-left transition-all",
                isSelected 
                  ? "bg-white border-zinc-900 shadow-sm ring-1 ring-zinc-900" 
                  : "bg-white border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50"
              )}
            >
              <div className="mr-4 shrink-0 bg-white rounded-full">
                {getStatusIcon(step.status)}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-zinc-900 truncate">{step.name}</h4>
                <p className="text-xs text-zinc-500 truncate">{step.provider_id}</p>
              </div>
              <div className="text-xs font-mono text-zinc-400 shrink-0 ml-3">
                {step.duration_ms}ms
              </div>
            </button>
          </div>
        );
      })}
    </div>
  );
}
