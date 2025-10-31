import { useCallback, useState } from "react";
import ReactFlow, { Background, Controls, MiniMap, BackgroundVariant } from "reactflow";
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
    nodeCount,
    edgeCount,
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
    console.log("Exported workflow:", JSON.stringify(workflow));

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
    const result = saveWorkflow();
    toast.success("Workflow saved!");
  }, [saveWorkflow]);

  const handleReset = useCallback(() => {
    if (nodeCount === 0) {
      toast.info("Canvas is already empty");
      return;
    }

    toast(`Reset workflow? This will remove ${nodeCount} nodes and ${edgeCount} connections.`, {
      action: {
        label: "Reset",
        onClick: () => {
          resetWorkflow();
          toast.info("Workflow reset successfully");
        },
      },
      duration: 8000,
    });
  }, [resetWorkflow, nodeCount, edgeCount]);

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
    <div className="flex h-screen w-full bg-slate-900">
      <Sidebar onAddNode={handleAddNode} />
      
      <div className="flex-1 relative">
        <Toolbar
          onExecute={handleExecute}
          onSave={handleSave}
          onReset={handleReset}
          isExecuting={isExecuting}
          nodeCount={nodeCount}
          edgeCount={edgeCount}
        />

        <ReactFlow
          nodes={enrichedNodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
          className="bg-gradient-to-br from-slate-900 to-slate-800"
          minZoom={0.2}
          maxZoom={2}
          defaultEdgeOptions={{
            type: 'smoothstep',
            style: {
              strokeWidth: 2,
              stroke: '#3b82f6',
            },
          }}
          connectionLineStyle={{
            strokeWidth: 2,
            stroke: '#3b82f6',
          }}
          selectNodesOnDrag={true}
          nodesDraggable={true}
          nodesConnectable={true}
          elementsSelectable={true}
          snapToGrid={false}
          deleteKeyCode={["Delete", "Backspace"]}
        >
          <Background 
            gap={20} 
            size={1} 
            color="#475569"
            variant={BackgroundVariant.Dots}
            className="bg-slate-900"
          />
          <Controls 
            className="controls-dark bg-slate-800/80 backdrop-blur-sm border border-slate-600 rounded-lg shadow-xl"
            showInteractive={true}
          />
          <MiniMap
            className="bg-slate-800/80 backdrop-blur-sm border border-slate-600 rounded-lg shadow-xl"
            nodeColor={(node) => {
              switch (node.data?.type) {
                case "swap": return '#3b82f6';
                case "stake": return '#8b5cf6';
                case "transfer": return '#10b981';
                case "claim": return '#f59e0b';
                case "schedule": return '#6366f1';
                default: return '#475569';
              }
            }}
            nodeStrokeWidth={2}
            maskColor="rgba(15, 23, 42, 0.6)"
            position="bottom-right"
          />
        </ReactFlow>

        {/* Add custom CSS for control buttons */}
        <style>{`
          .controls-dark button {
            background-color: #334155 !important;
            border: 1px solid #475569 !important;
            color: #cbd5e1 !important;
            border-radius: 4px !important;
          }
          .controls-dark button:hover {
            background-color: #475569 !important;
            color: #f1f5f9 !important;
          }
          .controls-dark button:active {
            background-color: #3b82f6 !important;
          }
        `}</style>
      </div>
    </div>
  );
};

export default Index;