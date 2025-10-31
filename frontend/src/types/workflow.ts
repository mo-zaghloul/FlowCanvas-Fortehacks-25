export type ActionType = "swap" | "stake" | "transfer" | "claim" | "schedule";

export interface NodeData {
  id: string;
  type: ActionType;
  label: string;
  params?: Record<string, string>;
}

export interface WorkflowNode {
  id: string;
  type: ActionType;
  params?: Record<string, string>;
}

export interface WorkflowEdge {
  from: string;
  to: string;
}

export interface Workflow {
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
}

export interface ActionBlockType {
  type: ActionType;
  label: string;
  icon: string;
  color: string;
  defaultParams?: Record<string, string>;
}
