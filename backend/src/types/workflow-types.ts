export interface Workflow {
  id: string;
  name: string;
  nodes: WorkflowNode[];
  entryPoint: string;
}
export interface WorkflowNode {
    id: string;
    type: 'source' | 'stake' | 'swap' | 'sink' | 'bridge';
    params: Record<string, unknown>;
    nextNodeId?: string;
}
