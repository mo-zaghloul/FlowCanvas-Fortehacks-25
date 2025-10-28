import { useCallback, useState } from "react";
import ReactFlow, { Background, Controls, MiniMap } from "reactflow";
import "reactflow/dist/style.css";
import axios from "axios";
import { Sidebar } from "@/components/Sidebar";
import { Toolbar } from "@/components/Toolbar";
import ActionNode from "@/components/nodes/ActionNode";
import { useWorkflow } from "@/hooks/useWorkflow";
import { toast } from "sonner";

const nodeTypes = {
  actionNode: ActionNode,
};

const Index = () => {
  const {
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
  } = useWorkflow();

  const [isExecuting, setIsExecuting] = useState(false);

  const handleAddNode = useCallback(
    (type: string, label: string, params?: Record<string, string>) => {
      addNode(type, label, params);
      toast.success("Node added to canvas");
    },
    [addNode]
  );

  const handleExecute = useCallback(async () => {
    const workflow = exportWorkflow();
    
    if (workflow.nodes.length === 0) {
      toast.error("Add some nodes first!");
      return;
    }

    setIsExecuting(true);
    toast.info("Executing workflow...");

    try {
      // Mock backend call - replace with real endpoint
      const response = await axios.post("/api/execute", workflow, {
        timeout: 5000,
      }).catch(() => {
        // Simulate successful execution for demo
        return { data: { success: true, message: "Workflow executed successfully" } };
      });

      toast.success(response.data.message || "Workflow executed!");
      console.log("Execution result:", response.data);
    } catch (error) {
      toast.error("Execution failed. Check console for details.");
      console.error("Execution error:", error);
    } finally {
      setIsExecuting(false);
    }
  }, [exportWorkflow]);

  const handleSave = useCallback(() => {
    saveWorkflow();
    toast.success("Workflow saved!");
  }, [saveWorkflow]);

  const handleReset = useCallback(() => {
    if (confirm("Reset canvas? This will clear all nodes and edges.")) {
      resetWorkflow();
      toast.info("Canvas reset");
    }
  }, [resetWorkflow]);

  // Enrich nodes with callbacks
  const enrichedNodes = nodes.map((node) => ({
    ...node,
    data: {
      ...node.data,
      onRemove: removeNode,
      onUpdateParams: updateNodeParams,
    },
  }));

  return (
    <div className="flex h-screen w-full bg-background">
      <Sidebar onAddNode={handleAddNode} />
      
      <div className="flex-1 relative">
        <Toolbar
          onExecute={handleExecute}
          onSave={handleSave}
          onReset={handleReset}
          isExecuting={isExecuting}
        />

        <ReactFlow
          nodes={enrichedNodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
          className="bg-gradient-to-br from-background to-muted/20"
        >
          <Background gap={20} size={1} color="hsl(var(--border))" />
          <Controls className="bg-card border-border" />
          <MiniMap
            className="bg-card border border-border"
            nodeColor={(node) => {
              switch (node.data.type) {
                case "swap": return "#3b82f6";
                case "stake": return "#a855f7";
                case "transfer": return "#10b981";
                case "claim": return "#f59e0b";
                case "schedule": return "#6366f1";
                default: return "#6b7280";
              }
            }}
          />
        </ReactFlow>
      </div>
    </div>
  );
};

export default Index;
