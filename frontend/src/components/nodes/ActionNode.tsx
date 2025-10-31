import { memo, useState, useCallback, useMemo } from "react";
import { Handle, Position, NodeProps } from "reactflow";
import { X, Edit2, Check } from "lucide-react";
import { NodeData } from "@/types/workflow";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ActionNodeProps extends NodeProps {
  data: NodeData & {
    onRemove?: (id: string) => void;
    onUpdateParams?: (id: string, params: Record<string, string>) => void;
  };
}

const ActionNode = memo(({ data, id, selected }: ActionNodeProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [localParams, setLocalParams] = useState(data.params || {});
  const [isHovered, setIsHovered] = useState(false);

  // Memoize the node color calculation - Updated to match landing page theme
  const nodeColor = useMemo(() => {
    switch (data.type) {
      case "swap": return "from-blue-500 to-cyan-500 bg-blue-500/20 border-blue-500/40";
      case "stake": return "from-purple-500 to-pink-500 bg-purple-500/20 border-purple-500/40";
      case "transfer": return "from-green-500 to-emerald-500 bg-green-500/20 border-green-500/40";
      case "claim": return "from-amber-500 to-yellow-500 bg-amber-500/20 border-amber-500/40";
      case "schedule": return "from-indigo-500 to-purple-500 bg-indigo-500/20 border-indigo-500/40";
      default: return "from-slate-600 to-slate-700 bg-slate-600/20 border-slate-600/40";
    }
  }, [data.type]);

  // Optimized event handlers
  const handleSave = useCallback(() => {
    data.onUpdateParams?.(id, localParams);
    setIsEditing(false);
  }, [data.onUpdateParams, id, localParams]);

  const handleEditToggle = useCallback(() => {
    setIsEditing(prev => !prev);
    // Reset local params when opening edit mode
    if (!isEditing) {
      setLocalParams(data.params || {});
    }
  }, [isEditing, data.params]);

  const handleRemove = useCallback(() => {
    data.onRemove?.(id);
  }, [data.onRemove, id]);

  const handleParamChange = useCallback((key: string, value: string) => {
    setLocalParams(prev => ({
      ...prev,
      [key]: value
    }));
  }, []);

  const handleMouseEnter = useCallback(() => setIsHovered(true), []);
  const handleMouseLeave = useCallback(() => setIsHovered(false), []);

  // Memoize the parameters display
  const paramsDisplay = useMemo(() => {
    if (!data.params || Object.keys(data.params).length === 0) return null;
    
    return Object.entries(data.params).map(([key, value]) => (
      <div key={key} className="flex justify-between text-xs">
        <span className="text-slate-400">{key}:</span>
        <span className="font-medium text-slate-200 truncate ml-2 max-w-[120px]">{value}</span>
      </div>
    ));
  }, [data.params]);

  // Memoize edit form
  const editForm = useMemo(() => {
    if (!isEditing) return null;

    return (
      <div className="p-3 space-y-2 bg-slate-800/50 border-t border-slate-700">
        {Object.entries(localParams).map(([key, value]) => (
          <div key={key} className="space-y-1">
            <label className="text-xs font-medium text-slate-300 capitalize">
              {key.replace(/([A-Z])/g, ' $1').trim()}
            </label>
            <Input
              value={value}
              onChange={(e) => handleParamChange(key, e.target.value)}
              className="h-8 text-xs bg-slate-700 border-slate-600 text-slate-200 focus:ring-2 focus:ring-blue-500/20"
              placeholder={`Enter ${key}`}
            />
          </div>
        ))}
        <Button
          onClick={handleSave}
          size="sm"
          className="w-full h-8 text-xs bg-blue-600 hover:bg-blue-700 text-white"
        >
          Save Parameters
        </Button>
      </div>
    );
  }, [isEditing, localParams, handleParamChange, handleSave]);

  return (
    <div 
      className={`
        min-w-[220px] bg-slate-800 rounded-lg shadow-lg border overflow-hidden
        transition-all duration-200 ease-in-out
        ${selected ? 'border-blue-500 shadow-blue-500/20 scale-105' : 'border-slate-700'}
        ${isHovered ? 'shadow-lg scale-[1.02]' : ''}
      `}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Target Handle - Updated colors */}
      <Handle
        type="target"
        position={Position.Left}
        className="!w-4 !h-4 !bg-blue-500 !border-2 !border-slate-800 !shadow-lg"
        style={{ left: -8 }}
      />
      
      {/* Header - Updated to match dark theme */}
      <div 
        className={`bg-gradient-to-r ${nodeColor.split(' ')[0]} ${nodeColor.split(' ')[1]} p-3 flex items-center justify-between node-drag-handle cursor-move`}
      >
        <div className="flex items-center gap-2">
          <span className="text-white font-semibold text-sm select-none">
            {data.label}
          </span>
        </div>
        <div className={`flex gap-1 ${isHovered ? 'opacity-100' : 'opacity-80'}`}>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-white hover:bg-white/20"
            onClick={handleEditToggle}
          >
            {isEditing ? <Check className="h-3 w-3" /> : <Edit2 className="h-3 w-3" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-white hover:bg-red-500/50"
            onClick={handleRemove}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {/* Edit Form */}
      {editForm}

      {/* Parameters Display - Updated colors */}
      {!isEditing && data.params && Object.keys(data.params).length > 0 && (
        <div className="p-3 space-y-1 bg-slate-700/30 border-t border-slate-700">
          {paramsDisplay}
        </div>
      )}

      {/* Source Handle - Updated colors */}
      <Handle
        type="source"
        position={Position.Right}
        className="!w-4 !h-4 !bg-blue-500 !border-2 !border-slate-800 !shadow-lg"
        style={{ right: -8 }}
      />
    </div>
  );
});

ActionNode.displayName = "ActionNode";

export default ActionNode;