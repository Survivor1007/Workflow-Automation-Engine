import { Card } from "../components/common/Card";
import { ExecutionTable } from "../components/execution/ExecutionTable";
import { Activity, CheckCircle2, XCircle, Zap, Loader2 } from "lucide-react";
import { useWorkflows, useRecentExecutions } from "../hooks/useWorkflows";

export default function Dashboard() {
  const { data: workflows, isLoading: isLoadingWorkflows } = useWorkflows();
  const { data: executions, isLoading: isLoadingExecutions } = useRecentExecutions();

  if (isLoadingWorkflows || isLoadingExecutions) {
    return (
      <div className="flex h-full items-center justify-center text-zinc-500">
        <Loader2 className="w-6 h-6 animate-spin mr-2" />
        <span>Loading system metrics...</span>
      </div>
    );
  }

  // Derived metrics from live data
  const totalWorkflows = workflows?.length || 0;
  const activeWorkflows = workflows?.filter(w => w.is_active).length || 0;
  const totalExecutions = executions?.length || 0;
  const failedExecutions = executions?.filter(e => e.status === "FAILED").length || 0;
  
  const successRate = totalExecutions === 0 ? 100 : 
    (((totalExecutions - failedExecutions) / totalExecutions) * 100).toFixed(1);

  // Map API data to our table's expected prop shape
  const tableData = (executions || []).map(exe => ({
    id: exe.id,
    workflowName: exe.workflow_name || `Workflow ${exe.workflow_id}`,
    trigger: "Webhook", // We'll map this dynamically later
    status: exe.status,
    duration: `${exe.duration_ms}ms`,
    timestamp: new Date(exe.started_at).toLocaleTimeString(),
  }));

  return (
    <div className="flex-1 h-full overflow-y-auto p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900 tracking-tight">System Dashboard</h1>
          <p className="text-sm text-zinc-500 mt-1">Real-time overview of your workflow automation engine.</p>
        </div>

        {/* Top-line Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4 flex items-start space-x-4">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Zap className="w-5 h-5" /></div>
            <div>
              <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Total Workflows</p>
              <h3 className="text-2xl font-semibold text-zinc-900 mt-0.5">{totalWorkflows}</h3>
            </div>
          </Card>
          
          <Card className="p-4 flex items-start space-x-4">
            <div className="p-2 bg-zinc-100 text-zinc-600 rounded-lg"><Activity className="w-5 h-5" /></div>
            <div>
              <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Recent Executions</p>
              <h3 className="text-2xl font-semibold text-zinc-900 mt-0.5">{totalExecutions}</h3>
            </div>
          </Card>

          <Card className="p-4 flex items-start space-x-4">
            <div className="p-2 bg-green-50 text-green-600 rounded-lg"><CheckCircle2 className="w-5 h-5" /></div>
            <div>
              <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Success Rate</p>
              <h3 className="text-2xl font-semibold text-zinc-900 mt-0.5">{successRate}%</h3>
            </div>
          </Card>

          <Card className="p-4 flex items-start space-x-4">
            <div className="p-2 bg-red-50 text-red-600 rounded-lg"><XCircle className="w-5 h-5" /></div>
            <div>
              <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Failures</p>
              <h3 className="text-2xl font-semibold text-zinc-900 mt-0.5">{failedExecutions}</h3>
            </div>
          </Card>
        </div>

        {/* Recent Executions Table */}
        <Card>
          <div className="px-4 py-3 border-b border-zinc-200 flex justify-between items-center bg-white">
            <h2 className="text-sm font-semibold text-zinc-900">Live Execution Stream</h2>
          </div>
          <ExecutionTable executions={tableData} />
        </Card>

      </div>
    </div>
  );
}