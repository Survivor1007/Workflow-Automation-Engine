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
export interface ProviderSchema {
    provider_id: string;
    name: string;
    type: "trigger" | "action";
    schema: any; 
}