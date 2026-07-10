import { Badge, type ExecutionStatus } from "../common/Badge";
import { Button } from "../common/Button";
import { Search } from "lucide-react";

// Temporary mock type until we build the TanStack API layer
export type MockExecution = {
  id: string;
  workflowName: string;
  trigger: string;
  status: ExecutionStatus;
  duration: string;
  timestamp: string;
};

interface ExecutionTableProps {
  executions: MockExecution[];
}

export function ExecutionTable({ executions }: ExecutionTableProps) {
  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-left text-sm whitespace-nowrap">
        <thead className="bg-zinc-50 border-y border-zinc-200 text-zinc-500 text-xs uppercase tracking-wider font-semibold">
          <tr>
            <th className="px-4 py-3">Workflow Name</th>
            <th className="px-4 py-3">Trigger</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Duration</th>
            <th className="px-4 py-3">Started</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-200 bg-white">
          {executions.map((exe) => (
            <tr key={exe.id} className="hover:bg-zinc-50 transition-colors">
              <td className="px-4 py-3 font-medium text-zinc-900">{exe.workflowName}</td>
              <td className="px-4 py-3 text-zinc-600">{exe.trigger}</td>
              <td className="px-4 py-3"><Badge status={exe.status} /></td>
              <td className="px-4 py-3 text-zinc-600">{exe.duration}</td>
              <td className="px-4 py-3 text-zinc-500 font-mono text-xs">{exe.timestamp}</td>
              <td className="px-4 py-3 text-right">
                <Button variant="ghost" size="sm">
                  <Search className="w-4 h-4 mr-1.5" />
                  Inspect
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}