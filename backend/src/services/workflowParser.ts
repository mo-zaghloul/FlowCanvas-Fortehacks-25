export interface WorkflowNode {
  id: string;
  type: string;
  params: Record<string, unknown>;
}

export interface WorkflowEdge {
  from: string;
  to: string;
}

export interface Workflow {
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
}

export interface SingleNodeExecution {
    node: WorkflowNode;
    address: string;
    //  privateKey: string;
}

export function getExecutionOrder(workflow: Workflow): WorkflowNode[] {
  const nodeMap = new Map<string, WorkflowNode>();
  const inDegree = new Map<string, number>();
  const adjacency = new Map<string, string[]>();

  for (const node of workflow.nodes) {
    nodeMap.set(node.id, node);
    inDegree.set(node.id, 0);
    adjacency.set(node.id, []);
  }

  for (const { from, to } of workflow.edges) {
    if (!nodeMap.has(from) || !nodeMap.has(to)) {
      throw new Error(`Edge refers to unknown node: ${from} -> ${to}`);
    }
    adjacency.get(from)!.push(to);
    inDegree.set(to, (inDegree.get(to) ?? 0) + 1);
  }

  const queue: string[] = [];
  for (const [nodeId, degree] of inDegree.entries()) {
    if (degree === 0) queue.push(nodeId);
  }

  const ordered: WorkflowNode[] = [];
  while (queue.length > 0) {
    const currentId = queue.shift()!;
    ordered.push(nodeMap.get(currentId)!);

    for (const neighbor of adjacency.get(currentId) ?? []) {
      const nextDegree = (inDegree.get(neighbor) ?? 0) - 1;
      inDegree.set(neighbor, nextDegree);
      if (nextDegree === 0) queue.push(neighbor);
    }
  }

  if (ordered.length !== workflow.nodes.length) {
    throw new Error("Workflow contains a cycle or disconnected dependency.");
  }

  return ordered;
}