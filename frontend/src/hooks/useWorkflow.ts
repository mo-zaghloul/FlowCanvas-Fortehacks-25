import { useState, useCallback, useEffect } from "react";
import { Node, Edge, Connection, addEdge } from "reactflow";
import { NodeData, Workflow } from "@/types/workflow";

const STORAGE_KEY = "forte-workflow";

export const useWorkflow = () => {
  const [nodes, setNodes] = useState<Node<NodeData>[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);

  // Load workflow from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const { nodes: savedNodes, edges: savedEdges } = JSON.parse(saved);
        setNodes(savedNodes);
        setEdges(savedEdges);
      } catch (error) {
        console.error("Failed to load workflow:", error);
      }
    }
  }, []);

  const onNodesChange = useCallback((changes: any) => {
    setNodes((nds) => {
      const updated = nds.map((node) => {
        const change = changes.find((c: any) => c.id === node.id);
        if (change?.position) {
          return { ...node, position: change.position };
        }
        return node;
      });
      return updated.filter((node) => 
        !changes.some((c: any) => c.id === node.id && c.type === "remove")
      );
    });
  }, []);

  const onEdgesChange = useCallback((changes: any) => {
    setEdges((eds) => 
      eds.filter((edge) => 
        !changes.some((c: any) => c.id === edge.id && c.type === "remove")
      )
    );
  }, []);

  const onConnect = useCallback((connection: Connection) => {
    setEdges((eds) => addEdge(connection, eds));
  }, []);

  const addNode = useCallback((type: string, label: string, params?: Record<string, string>) => {
    const id = `${type}-${Date.now()}`;
    const newNode: Node<NodeData> = {
      id,
      type: "actionNode",
      position: { x: Math.random() * 400 + 100, y: Math.random() * 300 + 100 },
      data: {
        id,
        type: type as any,
        label,
        params: params || {},
      },
    };
    setNodes((nds) => [...nds, newNode]);
  }, []);

  const updateNodeParams = useCallback((nodeId: string, params: Record<string, string>) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === nodeId
          ? { ...node, data: { ...node.data, params } }
          : node
      )
    );
  }, []);

  const removeNode = useCallback((nodeId: string) => {
    setNodes((nds) => nds.filter((node) => node.id !== nodeId));
    setEdges((eds) => eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId));
  }, []);

  const saveWorkflow = useCallback(() => {
    const workflow = { nodes, edges };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(workflow));
  }, [nodes, edges]);

  const resetWorkflow = useCallback(() => {
    setNodes([]);
    setEdges([]);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const exportWorkflow = useCallback((): Workflow => {
    return {
      nodes: nodes.map((node) => ({
        id: node.id,
        type: node.data.type,
        params: node.data.params,
      })),
      edges: edges.map((edge) => ({
        from: edge.source,
        to: edge.target,
      })),
    };
  }, [nodes, edges]);

  return {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    addNode,
    updateNodeParams,
    removeNode,
    saveWorkflow,
    resetWorkflow,
    exportWorkflow,
  };
};
