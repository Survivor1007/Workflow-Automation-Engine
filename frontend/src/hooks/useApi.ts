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
      let workflowId = id;

      // STEP 1: Save the Workflow Metadata (Name, Status)
      if (id === "new") {
        // Create new workflow
        const wfResponse = await apiClient.post("/workflows/", { 
          name: payload.name, 
          is_active: payload.is_active 
        });
        workflowId = wfResponse.data.id;
      } else {
        // Update existing workflow
        await apiClient.put(`/workflows/${id}`, { 
          name: payload.name, 
          is_active: payload.is_active 
        });
      }

      // STEP 2: Bulk Sync the Steps
      // Map frontend Zustand state to backend StepCreate schema
      const stepsPayload = payload.steps.map((step: any, index: number) => ({
        step_order: index,
        step_type: step.type.toUpperCase(), // "TRIGGER" or "ACTION"
        node_provider: step.provider_id,
        config_json: step.config
      }));


      await apiClient.put(`/workflows/${workflowId}/steps/`, stepsPayload);

      return { id: workflowId };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workflows"] });
    },
  });
};