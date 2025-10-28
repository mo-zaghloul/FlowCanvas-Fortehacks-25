import { memo, useState } from "react";
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

const ActionNode = memo(({ data, id }: ActionNodeProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [params, setParams] = useState(data.params || {});

  const handleSave = () => {
    if (data.onUpdateParams) {
      data.onUpdateParams(id, params);
    }
    setIsEditing(false);
  };

  const getNodeColor = () => {
    switch (data.type) {
      case "swap": return "from-blue-500 to-cyan-500";
      case "stake": return "from-purple-500 to-pink-500";
      case "transfer": return "from-green-500 to-emerald-500";
      case "claim": return "from-orange-500 to-yellow-500";
      case "schedule": return "from-indigo-500 to-purple-500";
      default: return "from-gray-500 to-gray-600";
    }
  };

  return (
    <div className="min-w-[220px] bg-card rounded-lg shadow-lg border-2 border-border overflow-hidden">
      <Handle type="target" position={Position.Right} className="!bg-primary w-3 h-3" />
      
      <div className={`bg-gradient-to-r ${getNodeColor()} p-3 flex items-center justify-between`}>
        <div className="flex items-center gap-2">
          <div className="absolute top-1/2 -translate-y-1/2 right-0 translate-x-1/2 w-2 h-2 bg-white rounded-full" />
          <span className="text-white font-semibold text-sm">{data.label}</span>
        </div>
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-white hover:bg-white/20"
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? <Check className="h-3 w-3" /> : <Edit2 className="h-3 w-3" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-white hover:bg-white/20"
            onClick={() => data.onRemove?.(id)}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {isEditing && (
        <div className="p-3 space-y-2 bg-muted/30">
          {Object.entries(params).map(([key, value]) => (
            <div key={key} className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">{key}</label>
              <Input
                value={value}
                onChange={(e) => setParams({ ...params, [key]: e.target.value })}
                className="h-8 text-xs"
                placeholder={`Enter ${key}`}
              />
            </div>
          ))}
          <Button
            onClick={handleSave}
            size="sm"
            className="w-full h-8 text-xs"
          >
            Save Parameters
          </Button>
        </div>
      )}

      {!isEditing && data.params && Object.keys(data.params).length > 0 && (
        <div className="p-3 space-y-1 bg-muted/20">
          {Object.entries(data.params).map(([key, value]) => (
            <div key={key} className="flex justify-between text-xs">
              <span className="text-muted-foreground">{key}:</span>
              <span className="font-medium truncate ml-2 max-w-[120px]">{value}</span>
            </div>
          ))}
        </div>
      )}

      <Handle type="source" position={Position.Left} className="!bg-primary w-3 h-3" />
    </div>
  );
});

ActionNode.displayName = "ActionNode";

export default ActionNode;
