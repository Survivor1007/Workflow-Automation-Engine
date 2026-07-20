import { useNavigate } from "react-router-dom";
import { useWorkflows } from "../hooks/useApi";
import { Card } from "../components/common/Card";
import { Button } from "../components/common/Button";
import { Plus, Edit2, Play, Loader2 } from "lucide-react";

export default function Workflows() {
  const navigate = useNavigate();
  const { data: workflows, isLoading, isError } = useWorkflows();

  return (
    <div className="flex-1 h-full overflow-y-auto p-8 bg-zinc-50">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header with the New Workflow Button */}
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-2xl font-semibold text-zinc-900 tracking-tight">Workflows</h1>
            <p className="text-sm text-zinc-500 mt-1">Manage and configure your automation pipelines.</p>
          </div>
          <Button variant="primary" onClick={() => navigate("/workflows/new")}>
            <Plus className="w-4 h-4 mr-2" /> New Workflow
          </Button>
        </div>

        <Card>
          {isLoading ? (
            <div className="p-12 flex justify-center text-zinc-500">
              <Loader2 className="w-6 h-6 animate-spin mr-2" /> Loading workflows...
            </div>
          ) : isError ? (
            <div className="p-12 text-center text-red-500">Failed to load workflows.</div>
          ) : (
            <div className="w-full overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-500 text-xs uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Created</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 bg-white">
                  {workflows?.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-4 py-8 text-center text-zinc-500">
                        No workflows created yet. Click "New Workflow" to get started.
                      </td>
                    </tr>
                  ) : (
                    workflows?.map((wf) => (
                      <tr key={wf.id} className="hover:bg-zinc-50 transition-colors">
                        <td className="px-4 py-3 font-medium text-zinc-900">{wf.name}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${wf.is_active ? "bg-green-50 text-green-700 border-green-200" : "bg-zinc-100 text-zinc-600 border-zinc-200"}`}>
                            {wf.is_active ? "Active" : "Disabled"}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-zinc-500 font-mono text-xs">
                          {wf.created_at ? new Date(wf.created_at).toLocaleDateString() : "N/A"}
                        </td>
                        <td className="px-4 py-3 text-right space-x-2">
                          {/* Future feature: Trigger workflow manually via UI */}
                          <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
                            <Play className="w-4 h-4 mr-1.5" /> Run
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => navigate(`/workflows/${wf.id}`)}>
                            <Edit2 className="w-4 h-4 mr-1.5" /> Edit
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}