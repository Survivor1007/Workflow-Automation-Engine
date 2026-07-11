import { create } from "zustand";

// Represents a single step in the linear pipeline
export interface WorkflowStep {
  id: string;              // Unique UI ID (e.g., UUID or frontend generated)
  provider_id: string;     // Matches the backend plugin (e.g., 'discord_action')
  name: string;            // Human-readable name
  type: "trigger" | "action";
  config: Record<string, any>; // Holds the uncommitted form data
}

interface EditorState {
  workflowId: string | null;
  steps: WorkflowStep[];
  selectedStepId: string | null;
  
  // Actions
  initializeEditor: (workflowId: string, steps: WorkflowStep[]) => void;
  addStep: (step: Omit<WorkflowStep, "id">) => void;
  removeStep: (id: string) => void;
  selectStep: (id: string | null) => void;
  updateStepConfig: (id: string, newConfig: Record<string, any>) => void;
}

export const useEditorStore = create<EditorState>((set) => ({
  workflowId: null,
  steps: [],
  selectedStepId: null,

  initializeEditor: (workflowId, steps) => set({ workflowId, steps, selectedStepId: null }),
  
  addStep: (stepData) => set((state) => ({
    steps: [...state.steps, { ...stepData, id: crypto.randomUUID() }]
  })),

  removeStep: (id) => set((state) => ({
    steps: state.steps.filter((s) => s.id !== id),
    selectedStepId: state.selectedStepId === id ? null : state.selectedStepId
  })),

  selectStep: (id) => set({ selectedStepId: id }),

  updateStepConfig: (id, newConfig) => set((state) => ({
    steps: state.steps.map((step) => 
      step.id === id ? { ...step, config: { ...step.config, ...newConfig } } : step
    )
  })),
}));