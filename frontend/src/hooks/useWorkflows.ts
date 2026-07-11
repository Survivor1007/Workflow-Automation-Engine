import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../services/apiClient";
import { type Workflow, type ExecutionSummary } from "../types/api";


// --- API Service Calls ---
const fetchWorkflows = async(): Promise<Workflow[]> => {
    const { data } = await apiClient.get("/workflows");
    return data;
}

const fetchRecentExecutions = async (): Promise<ExecutionSummary[]> => {
    // Assuming a generic endpoint for dashboard execution history
    const { data } = await apiClient.get("/executions?limit=10");
    return data;
};


// --- TanStack Query Hooks ---
export const useWorkflows = () => {
    return useQuery({
        queryKey: ["workflows"],
        queryFn: fetchWorkflows,
        select: (data) => Array.isArray(data) ? data :  [],
    });
};

export const useRecentExecutions = () => {
  return useQuery({
    queryKey: ["executions", "recent"],
    queryFn: fetchRecentExecutions,
    select: (data) => Array.isArray(data) ? data : [],
    refetchInterval: 5000, // Poll every 5 seconds for dashboard live-updates
  });
};