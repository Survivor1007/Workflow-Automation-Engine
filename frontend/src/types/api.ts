export type ExecutionStatus = "PENDING" | "RUNNING" | "SUCCESS" | "FAILED";

export interface Workflow {
    id: String;
    name: string;
    description: string;
    is_active: boolean;
    created_at: string;
}

export interface ExecutionSummary {
    id: string;
    workflow_id: string;
    workflow_name: string;
    status: ExecutionStatus;
    duration_ms: number;
    started_at: string;
}

// We'll expand this later when we build the Provider UI
// export interface ProviderSchema {
//     provider_id: string;
//     name: string;
//     type: "trigger" | "action";
//     schema: any; 
// }

export interface SchemaField {
    name: string;
    type: "string" | "textarea" | "integer" | "boolean";
    title: string;
    description?: string;
    required?: boolean;
    default?: any;
}

export interface ProviderSchema {
  provider_id: string;
  name: string;
  type: "trigger" | "action";
  fields: SchemaField[];
}

export interface StepExecutionTrace {
  step_id: string;
  provider_id: string;
  name: string;
  status: ExecutionStatus;
  duration_ms: number;
  input_context: Record<string, any>;
  output_context: Record<string, any> | null;
  error_message: string | null;
  logs: string[];
}

export interface DetailedExecution {
  id: string;
  workflow_id: string;
  workflow_name: string;
  global_status: ExecutionStatus;
  total_duration_ms: number;
  started_at: string;
  steps: StepExecutionTrace[];
}