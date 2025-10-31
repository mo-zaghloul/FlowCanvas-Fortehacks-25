<<<<<<< HEAD
import { useState, useCallback, useEffect } from "react";
import { Node, Edge, Connection, addEdge } from "reactflow";
=======
import { useState, useCallback, useEffect, useRef } from "react";
import { Node, Edge, Connection, addEdge, applyEdgeChanges, applyNodeChanges, NodeChange, EdgeChange } from "reactflow";
>>>>>>> 8843aa9 (Maintaining performance, enhancing styles and adding Landing page)
import { NodeData, Workflow } from "@/types/workflow";

const STORAGE_KEY = "forte-workflow";

<<<<<<< HEAD
export const useWorkflow = () => {
  const [nodes, setNodes] = useState<Node<NodeData>[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);

  // Load workflow from localStorage on mount
  useEffect(() => {
=======
// Debounce function for performance
const debounce = <T extends (...args: any[]) => void>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

export const useWorkflow = () => {
  const [nodes, setNodes] = useState<Node<NodeData>[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const isInitialized = useRef(false);

  // Load workflow from localStorage on mount
  useEffect(() => {
    if (isInitialized.current) return;
    
>>>>>>> 8843aa9 (Maintaining performance, enhancing styles and adding Landing page)
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const { nodes: savedNodes, edges: savedEdges } = JSON.parse(saved);
<<<<<<< HEAD
        setNodes(savedNodes);
        setEdges(savedEdges);
=======
        
        // Validate and restore nodes with proper positions
        const restoredNodes = savedNodes.map((node: Node<NodeData>) => ({
          ...node,
          position: node.position || { x: Math.random() * 400 + 100, y: Math.random() * 300 + 100 },
          data: {
            ...node.data,
            params: node.data.params || {},
          }
        }));
        
        setNodes(restoredNodes);
        setEdges(savedEdges || []);
>>>>>>> 8843aa9 (Maintaining performance, enhancing styles and adding Landing page)
      } catch (error) {
        console.error("Failed to load workflow:", error);
      }
    }
<<<<<<< HEAD
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
=======
    isInitialized.current = true;
  }, []);

  // Debounced save to localStorage
  const debouncedSave = useCallback(
    debounce((nodes: Node[], edges: Edge[]) => {
      const workflow = { nodes, edges };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(workflow));
    }, 500),
    []
  );

  // Auto-save when nodes or edges change
  useEffect(() => {
    if (isInitialized.current && nodes.length > 0) {
      debouncedSave(nodes, edges);
    }
  }, [nodes, edges, debouncedSave]);

  // Optimized node changes with proper ReactFlow change handling
  const onNodesChange = useCallback((changes: NodeChange[]) => {
    setNodes((nds) => applyNodeChanges(changes, nds));
  }, []);

  // Optimized edge changes with proper ReactFlow change handling
  const onEdgesChange = useCallback((changes: EdgeChange[]) => {
    setEdges((eds) => applyEdgeChanges(changes, eds));
  }, []);

  // Enhanced connection with validation
  const onConnect = useCallback((connection: Connection) => {
    // Prevent circular connections
    if (connection.source === connection.target) return;
    
    // Prevent duplicate connections
    setEdges((eds) => {
      const exists = eds.some(
        edge => edge.source === connection.source && edge.target === connection.target
      );
      if (exists) return eds;
      
      return addEdge(
        { 
          ...connection, 
          type: 'smoothstep',
          style: { strokeWidth: 2, stroke: '#3b82f6' },
          animated: true
        }, 
        eds
>>>>>>> 8843aa9 (Maintaining performance, enhancing styles and adding Landing page)
      );
    });
  }, []);

<<<<<<< HEAD
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
=======
  // Optimized node addition with better positioning
  const addNode = useCallback((type: string, label: string, params?: Record<string, string>) => {
    const id = `${type}-${Date.now()}`;
    
    // Calculate position to avoid overlapping
    const lastNode = nodes[nodes.length - 1];
    const baseX = lastNode ? lastNode.position.x + 250 : 100;
    const baseY = lastNode ? lastNode.position.y : 100;
    
    const newNode: Node<NodeData> = {
      id,
      type: "actionNode",
      position: { 
        x: baseX, 
        y: baseY + (nodes.length % 3) * 20 // Stagger nodes slightly
      },
>>>>>>> 8843aa9 (Maintaining performance, enhancing styles and adding Landing page)
      data: {
        id,
        type: type as any,
        label,
<<<<<<< HEAD
        params: params || {},
      },
    };
    setNodes((nds) => [...nds, newNode]);
  }, []);

=======
        params: params || getDefaultParams(type),
      },
    };
    
    setNodes((nds) => [...nds, newNode]);
    return newNode.id; // Return ID for immediate use
  }, [nodes]);

  // Optimized parameter updates with immutability
>>>>>>> 8843aa9 (Maintaining performance, enhancing styles and adding Landing page)
  const updateNodeParams = useCallback((nodeId: string, params: Record<string, string>) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === nodeId
<<<<<<< HEAD
          ? { ...node, data: { ...node.data, params } }
=======
          ? { 
              ...node, 
              data: { 
                ...node.data, 
                params: { ...params } 
              } 
            }
>>>>>>> 8843aa9 (Maintaining performance, enhancing styles and adding Landing page)
          : node
      )
    );
  }, []);

<<<<<<< HEAD
  const removeNode = useCallback((nodeId: string) => {
    setNodes((nds) => nds.filter((node) => node.id !== nodeId));
    setEdges((eds) => eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId));
  }, []);

  const saveWorkflow = useCallback(() => {
    const workflow = { nodes, edges };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(workflow));
  }, [nodes, edges]);

=======
  // Enhanced node removal with cleanup
  const removeNode = useCallback((nodeId: string) => {
    setNodes((nds) => nds.filter((node) => node.id !== nodeId));
    setEdges((eds) => 
      eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId)
    );
  }, []);

  // Batch node operations for performance
  const batchUpdateNodes = useCallback((updates: Array<{ id: string; params: Record<string, string> }>) => {
    setNodes((nds) =>
      nds.map((node) => {
        const update = updates.find(u => u.id === node.id);
        return update 
          ? { ...node, data: { ...node.data, params: update.params } }
          : node;
      })
    );
  }, []);

  // Fixed workflow export - removed metadata to match Workflow type
  const exportWorkflow = useCallback((): Workflow => {
    const validatedNodes = nodes.map((node) => ({
      id: node.id,
      type: node.data.type,
      params: node.data.params,
    }));

    const validatedEdges = edges.map((edge) => ({
      from: edge.source,
      to: edge.target,
    }));

    return {
      nodes: validatedNodes,
      edges: validatedEdges,
    };
  }, [nodes, edges]);

  // Enhanced save with validation
  const saveWorkflow = useCallback(() => {
    const workflow = { nodes, edges };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(workflow));
    
    // Return success status
    return { success: true, nodeCount: nodes.length, edgeCount: edges.length };
  }, [nodes, edges]);

  // Enhanced reset with confirmation (caller should handle confirmation UI)
>>>>>>> 8843aa9 (Maintaining performance, enhancing styles and adding Landing page)
  const resetWorkflow = useCallback(() => {
    setNodes([]);
    setEdges([]);
    localStorage.removeItem(STORAGE_KEY);
<<<<<<< HEAD
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
=======
    return { success: true, message: "Workflow reset successfully" };
  }, []);

  // Additional utility functions
  const getNode = useCallback((nodeId: string) => {
    return nodes.find(node => node.id === nodeId);
  }, [nodes]);

  const getConnectedNodes = useCallback((nodeId: string) => {
    const connectedEdges = edges.filter(edge => 
      edge.source === nodeId || edge.target === nodeId
    );
    const connectedNodeIds = connectedEdges.flatMap(edge => 
      [edge.source, edge.target].filter(id => id !== nodeId)
    );
    return nodes.filter(node => connectedNodeIds.includes(node.id));
  }, [nodes, edges]);

  const validateWorkflow = useCallback(() => {
    const errors: string[] = [];
    
    // Check for disconnected nodes
    const connectedNodes = new Set(
      edges.flatMap(edge => [edge.source, edge.target])
    );
    
    nodes.forEach(node => {
      if (!connectedNodes.has(node.id)) {
        errors.push(`Node "${node.data.label}" is disconnected`);
      }
    });

    // Check for cycles (basic detection)
    const hasCycle = (() => {
      const visited = new Set();
      const recursionStack = new Set();

      const dfs = (nodeId: string) => {
        if (recursionStack.has(nodeId)) return true;
        if (visited.has(nodeId)) return false;

        visited.add(nodeId);
        recursionStack.add(nodeId);

        const outgoingEdges = edges.filter(edge => edge.source === nodeId);
        for (const edge of outgoingEdges) {
          if (dfs(edge.target)) return true;
        }

        recursionStack.delete(nodeId);
        return false;
      };

      for (const node of nodes) {
        if (dfs(node.id)) return true;
      }
      return false;
    })();

    if (hasCycle) {
      errors.push("Workflow contains cycles");
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings: hasCycle ? ["Workflow contains cycles which may cause infinite loops"] : []
>>>>>>> 8843aa9 (Maintaining performance, enhancing styles and adding Landing page)
    };
  }, [nodes, edges]);

  return {
<<<<<<< HEAD
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
=======
    // State
    nodes,
    edges,
    
    // Change handlers
    onNodesChange,
    onEdgesChange,
    onConnect,
    
    // Node operations
    addNode,
    updateNodeParams,
    removeNode,
    batchUpdateNodes,
    
    // Utility functions
    getNode,
    getConnectedNodes,
    validateWorkflow,
    
    // Workflow operations
    saveWorkflow,
    resetWorkflow,
    exportWorkflow,
    
    // State information
    isEmpty: nodes.length === 0,
    nodeCount: nodes.length,
    edgeCount: edges.length,
  };
};

// Helper function for default parameters
function getDefaultParams(type: string): Record<string, string> {
  switch (type) {
    case 'swap':
      return { 
        fromToken: 'FLOW', 
        toToken: 'USDC', 
        amount: '100',
        slippage: '1.0'
      };
    case 'stake':
      return { 
        token: 'FLOW', 
        amount: '100', 
        duration: '30',
        vault: 'default'
      };
    case 'transfer':
      return { 
        to: '0x...', 
        amount: '100', 
        token: 'FLOW',
        memo: ''
      };
    case 'claim':
      return { 
        vault: 'staking-vault', 
        reward: 'FLOW',
        autoCompound: 'true'
      };
    case 'schedule':
      return { 
        interval: '24h', 
        startTime: new Date().toISOString().split('T')[0],
        timezone: 'UTC'
      };
    default:
      return {};
  }
}
>>>>>>> 8843aa9 (Maintaining performance, enhancing styles and adding Landing page)
