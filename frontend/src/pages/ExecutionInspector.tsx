// ---
// File: frontend/src/pages/ExecutionInspector.tsx
// Function: This page brings it all together. The user clicks a step on the timeline, and the right side displays the exact inputs, outputs, and system logs recorded at that millisecond.
// ---
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Terminal, Loader2 } from "lucide-react";
import { ExecutionTimeline } from "../components/execution/ExecutionTimeline";
import { Badge } from "../components/common/Badge";
import { useExecutionTrace } from "../hooks/useApi";


export default function ExecutionInspector() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedStepId, setSelectedStepId] = useState<string | null>(null);

  // Fetch the rea trace from the SQLite database
  const { data: trace, isLoading, isError } = useExecutionTrace(id as string);

  useEffect(() => {
    // Automatically select the first step when data loads
    if (trace && trace.steps.length > 0 && !selectedStepId) {
      setSelectedStepId(trace.steps[0].step_id);
    }
  }, [trace, selectedStepId]);

  if (isLoading) {
    return <div className="p-8 text-zinc-500 flex items-center"><Loader2 className="animate-spin w-5 h-5 mr-3"/> Fetching trace from engine...</div>;
  }

  if (isError || !trace) {
    return <div className="p-8 text-red-500">Failed to load execution trace. It may have been deleted or the engine is offline.</div>;
  }

  const activeStep = trace.steps.find(s => s.step_id === selectedStepId);
  return (
    <div className="flex flex-col h-full bg-zinc-50 overflow-hidden">
      
      {/* Top Header */}
      <header className="flex items-center justify-between px-6 h-16 bg-white border-b border-zinc-200 shrink-0">
        <div className="flex items-center">
          <button onClick={() => navigate("/")} className="mr-4 text-zinc-400 hover:text-zinc-900 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-sm font-semibold text-zinc-900 flex items-center">
              Execution Trace <Badge status={trace.global_status} />
            </h2>
            <p className="text-xs text-zinc-500 mt-0.5">ID: {trace.id} • {trace.workflow_name}</p>
          </div>
        </div>
        <div className="text-xs font-mono text-zinc-500 bg-zinc-100 px-2 py-1 rounded">
          Total Duration: {trace.total_duration_ms}ms
        </div>
      </header>

      {/* 2-Pane Split */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* Left Pane: Timeline */}
        <div className="w-80 h-full overflow-y-auto border-r border-zinc-200 bg-zinc-50/50 shrink-0">
          <div className="p-4 border-b border-zinc-200">
            <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Execution Timeline</h3>
          </div>
          <ExecutionTimeline 
            steps={trace.steps} 
            selectedStepId={selectedStepId} 
            onSelectStep={setSelectedStepId} 
          />
        </div>

        {/* Right Pane: Trace Details */}
        <div className="flex-1 h-full bg-white overflow-y-auto p-6">
          {activeStep ? (
            <div className="max-w-4xl space-y-6">
              
              {/* Error Banner */}
              {activeStep.status === "FAILED" && activeStep.error_message && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-md">
                  <h4 className="text-sm font-semibold text-red-800 mb-1">Execution Halted</h4>
                  <p className="text-sm text-red-600 font-mono">{activeStep.error_message}</p>
                </div>
              )}

              {/* Logs Viewer */}
              <div>
                <h4 className="text-sm font-semibold text-zinc-900 mb-2 flex items-center">
                  <Terminal className="w-4 h-4 mr-2 text-zinc-500"/> System Logs
                </h4>
                <div className="bg-zinc-900 rounded-md p-4 overflow-x-auto shadow-inner">
                  {activeStep.logs.length > 0 ? (
                    <pre className="text-xs font-mono text-zinc-300 space-y-1">
                      {activeStep.logs.map((log, i) => (
                        <div key={i} className={log.includes("[ERROR]") ? "text-red-400" : log.includes("[WARN]") ? "text-amber-400" : ""}>
                          {log}
                        </div>
                      ))}
                    </pre>
                  ) : (
                    <span className="text-xs text-zinc-600 font-mono">No logs recorded for this step.</span>
                  )}
                </div>
              </div>

              {/* I/O Context Split */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-semibold text-zinc-900 mb-2">Input Context</h4>
                  <pre className="bg-zinc-50 border border-zinc-200 rounded-md p-3 text-xs font-mono text-zinc-700 overflow-x-auto">
                    {JSON.stringify(activeStep.input_context, null, 2)}
                  </pre>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-zinc-900 mb-2">Output Context</h4>
                  <pre className="bg-zinc-50 border border-zinc-200 rounded-md p-3 text-xs font-mono text-zinc-700 overflow-x-auto">
                    {activeStep.output_context 
                      ? JSON.stringify(activeStep.output_context, null, 2) 
                      : "// Step failed or produced no output"}
                  </pre>
                </div>
              </div>

            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-zinc-400 text-sm">
              Select a step from the timeline to view details.
            </div>
          )}
        </div>

      </div>
    </div>
  );
}