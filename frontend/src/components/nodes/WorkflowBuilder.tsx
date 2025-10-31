import React, { useCallback, useMemo } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  Connection,
  Edge,
  Node,
  ReactFlowProvider,
  ConnectionMode,
  BackgroundVariant,
} from 'reactflow';
import 'reactflow/dist/style.css';
import ActionNode from './ActionNode';
import { useWorkflow } from '@/hooks/useWorkflow';

const nodeTypes = {
  actionNode: ActionNode,
};

interface WorkflowBuilderProps {
  initialNodes?: Node[];
  initialEdges?: Edge[];
}

const WorkflowBuilder = ({ initialNodes = [], initialEdges = [] }: WorkflowBuilderProps) => {
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    removeNode,
    updateNodeParams,
  } = useWorkflow();

  // Memoize nodes with enhanced data
  const enhancedNodes = useMemo(() => 
    nodes.map((node) => ({
      ...node,
      data: {
        ...node.data,
        onRemove: removeNode,
        onUpdateParams: updateNodeParams,
      },
    }))
  , [nodes, removeNode, updateNodeParams]);

  return (
    <div className="w-full h-full bg-gradient-to-br from-slate-900 to-slate-800">
      <ReactFlow
        nodes={enhancedNodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
        minZoom={0.2}
        maxZoom={2}
        defaultEdgeOptions={{
          type: 'smoothstep',
          style: {
            strokeWidth: 2,
            stroke: '#3b82f6',
          },
          animated: true,
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
        snapGrid={[15, 15]}
        deleteKeyCode={["Delete", "Backspace"]}
        connectionMode={ConnectionMode.Loose}
      >
        <Background 
          gap={25} 
          size={1} 
          color="#475569"
          variant={BackgroundVariant.Dots} // Fixed: Use enum instead of string
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
          position="bottom-left"
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
  );
};

// Wrap with provider for proper context
export default function WorkflowBuilderWithProvider(props: WorkflowBuilderProps) {
  return (
    <ReactFlowProvider>
      <WorkflowBuilder {...props} />
    </ReactFlowProvider>
  );
}