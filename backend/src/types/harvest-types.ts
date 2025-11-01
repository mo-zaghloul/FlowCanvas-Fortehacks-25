export interface BaseWorkflowNode {
  type: string;
  params: Record<string, any>;
}

export interface SourceNode extends BaseWorkflowNode {
  type: 'source';
  params: SourceParams;
}

export interface SwapperNode extends BaseWorkflowNode {
  type: 'swapper';
  params: SwapperParams;
}

export interface SinkNode extends BaseWorkflowNode {
  type: 'sink';
  params: SinkParams;
}

export type WorkflowNode = SourceNode | SwapperNode | SinkNode;

export interface SourceParams {
  pool_id: number;
  user_address: string;
}

export interface SwapperParams {
  in: string;
  out: string;
}

export interface SinkParams {
  max_capacity: number;
}

export function isSourceNode(node: WorkflowNode): node is SourceNode {
  return node.type === 'source';
}

export function isSwapperNode(node: WorkflowNode): node is SwapperNode {
  return node.type === 'swapper';
}

export function isSinkNode(node: WorkflowNode): node is SinkNode {
  return node.type === 'sink';
}

export interface HarvestWorkflow {
  id: string;
  type: string;
  nodes: WorkflowNode[];
}

export interface HarvestRequestBody {
  workflow: HarvestWorkflow;
}

export interface HarvestResponse {
  success: boolean;
  tx?: string;
  error?: string;
}