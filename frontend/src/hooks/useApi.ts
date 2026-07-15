import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { apiClient } from "../services/apiClient";
import { type Workflow, type ExecutionSummary, type ProviderSchema, type DetailedExecution } from "../types/api";

// --- Queries (Fetching Data) ---

export const useWorkflows = () => {
  return useQuery({
    queryKey: ["workflows"],
    queryFn: async () => (await apiClient.get<Workflow[]>("/workflows")).data,
  });
};

export const useRecentExecutions = () => {
  return useQuery({
    queryKey: ["executions", "recent"],
    queryFn: async () => (await apiClient.get<ExecutionSummary[]>("/executions?limit=10")).data,
    refetchInterval: 5000, 
  });
};

export const useProviders = () => {
  return useQuery({
    queryKey: ["providers"],
    queryFn: async () => (await apiClient.get<ProviderSchema[]>("/providers")).data,
  });
};

export const useExecutionTrace = (executionId: string) => {
  return useQuery({
    queryKey: ["executions", executionId],
    queryFn: async () => (await apiClient.get<DetailedExecution>(`/executions/${executionId}`)).data,
    enabled: !!executionId, // Only run if we have an ID
  });
};

// --- Mutations (Modifying Data) ---

export const useSaveWorkflow = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: any }) => {
      // If "new", POST to create. Otherwise, PUT to update.
      if (id === "new") {
        return (await apiClient.post("/workflows", payload)).data;
      }
      return (await apiClient.put(`/workflows/${id}`, payload)).data;
    },
    onSuccess: () => {
      // Invalidate the workflows list so the Dashboard updates instantly
      queryClient.invalidateQueries({ queryKey: ["workflows"] });
    },
  });
};