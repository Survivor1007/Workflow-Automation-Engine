import { Card } from "../components/common/Card";
import { ExecutionTable, type MockExecution } from "../components/execution/ExecutionTable";
import { Activity, CheckCircle2, XCircle, Zap } from "lucide-react";

// Mock data to visualize the layout before hooking up the FastAPI backend
const mockExecutions: MockExecution[] = [
  { id: "ex_8902", workflowName: "Discord Alerts", trigger: "Webhook", status: "FAILED", duration: "1.2s", timestamp: "2 mins ago" },
  { id: "ex_8901", workflowName: "Daily Backup", trigger: "Cron", status: "SUCCESS", duration: "4.5s", timestamp: "1 hour ago" },
  { id: "ex_8900", workflowName: "Lead Sync", trigger: "Webhook", status: "SUCCESS", duration: "0.8s", timestamp: "3 hours ago" },
  { id: "ex_8899", workflowName: "Discord Alerts", trigger: "Webhook", status: "SUCCESS", duration: "1.1s", timestamp: "5 hours ago" },
];

export default function Dashboard() {
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
              <h3 className="text-2xl font-semibold text-zinc-900 mt-0.5">12</h3>
            </div>
          </Card>
          
          <Card className="p-4 flex items-start space-x-4">
            <div className="p-2 bg-zinc-100 text-zinc-600 rounded-lg"><Activity className="w-5 h-5" /></div>
            <div>
              <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Executions (24h)</p>
              <h3 className="text-2xl font-semibold text-zinc-900 mt-0.5">1,402</h3>
            </div>
          </Card>

          <Card className="p-4 flex items-start space-x-4">
            <div className="p-2 bg-green-50 text-green-600 rounded-lg"><CheckCircle2 className="w-5 h-5" /></div>
            <div>
              <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Success Rate</p>
              <h3 className="text-2xl font-semibold text-zinc-900 mt-0.5">98.2%</h3>
            </div>
          </Card>

          <Card className="p-4 flex items-start space-x-4">
            <div className="p-2 bg-red-50 text-red-600 rounded-lg"><XCircle className="w-5 h-5" /></div>
            <div>
              <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Failures</p>
              <h3 className="text-2xl font-semibold text-zinc-900 mt-0.5">24</h3>
            </div>
          </Card>
        </div>

        {/* Recent Executions Table */}
        <Card>
          <div className="px-4 py-3 border-b border-zinc-200 flex justify-between items-center bg-white">
            <h2 className="text-sm font-semibold text-zinc-900">Recent Executions</h2>
          </div>
          <ExecutionTable executions={mockExecutions} />
        </Card>

      </div>
    </div>
  );
}