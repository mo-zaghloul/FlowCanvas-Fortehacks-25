export interface NodeData {
  id: string;
  type: string;
  params: Record<string, any>;
}

export interface EdgeData {
  from: string;
  to: string;
}

export interface Workflow {
  nodes: NodeData[];
  edges: EdgeData[];
}

export function getExecutionOrder(workflow: Workflow): NodeData[] {
  const adj: Record<string, string[]> = {};
  workflow.nodes.forEach(n => adj[n.id] = []);
  workflow.edges.forEach(e => adj[e.from].push(e.to));

  const visited = new Set<string>();
  const result: NodeData[] = [];

  function dfs(nodeId: string) {
    if (visited.has(nodeId)) return;
    visited.add(nodeId);
    adj[nodeId].forEach(dfs);
    const node = workflow.nodes.find(n => n.id === nodeId);
    if (node) result.unshift(node);
  }

  workflow.nodes.forEach(n => dfs(n.id));
  return result;
}
