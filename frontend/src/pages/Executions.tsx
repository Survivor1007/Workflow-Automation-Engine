import { useRecentExecutions } from "../hooks/useApi";
import { Card } from "../components/common/Card";
import { ExecutionTable } from "../components/execution/ExecutionTable";
import { Loader2 } from "lucide-react";

export default function Executions() {
  // Pulling the same hook, but you could add pagination parameters here later!
  const { data: executions, isLoading, isError } = useRecentExecutions();

  const tableData = (executions || []).map(exe => ({
    id: exe.id,
    workflowName: exe.workflow_name || `Workflow ${exe.workflow_id}`,
    trigger: "Webhook", 
    status: exe.status,
    duration: `${exe.duration_ms}ms`,
    timestamp: new Date(exe.started_at).toLocaleString(),
  }));

  return (
    <div className="flex-1 h-full overflow-y-auto p-8 bg-zinc-50">
      <div className="max-w-6xl mx-auto space-y-6">
        
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900 tracking-tight">Execution History</h1>
          <p className="text-sm text-zinc-500 mt-1">Global audit log of all automated runs across your system.</p>
        </div>

        <Card>
          {isLoading ? (
            <div className="p-12 flex justify-center text-zinc-500">
              <Loader2 className="w-6 h-6 animate-spin mr-2" /> Loading execution logs...
            </div>
          ) : isError ? (
            <div className="p-12 text-center text-red-500">Failed to load execution logs.</div>
          ) : (
            <ExecutionTable executions={tableData} />
          )}
        </Card>

      </div>
    </div>
  );
}