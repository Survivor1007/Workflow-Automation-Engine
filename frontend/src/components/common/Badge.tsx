import { cn } from "../../utils/cn";

export type ExecutionStatus = "PENDING" | "RUNNING" | "SUCCESS" | "FAILED";

interface BadgeProps {
  status: ExecutionStatus;
}

export function Badge({ status }: BadgeProps) {
  const statusStyles: Record<ExecutionStatus, string> = {
    PENDING: "bg-blue-50 text-blue-700 border-blue-200",
    RUNNING: "bg-amber-50 text-amber-700 border-amber-200 animate-pulse",
    SUCCESS: "bg-green-50 text-green-700 border-green-200",
    FAILED: "bg-red-50 text-red-700 border-red-200",
  };

  return (
    <span className={cn(
      "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border",
      statusStyles[status]
    )}>
      {status}
    </span>
  );
}