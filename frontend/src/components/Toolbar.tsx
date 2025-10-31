// components/Toolbar.tsx
import { Play, Save, RotateCcw, Loader2, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ToolbarProps {
  onExecute: () => void;
  onSave: () => void;
  onReset: () => void;
  isExecuting: boolean;
  nodeCount?: number;  // Add these optional props
  edgeCount?: number;
  lastSaved?: string;
}

export const Toolbar = ({ 
  onExecute, 
  onSave, 
  onReset, 
  isExecuting, 
  nodeCount = 0,
  edgeCount = 0,
  lastSaved 
}: ToolbarProps) => {
  return (
    <div className="absolute top-4 right-4 z-10 flex gap-2 bg-slate-800/90 backdrop-blur-sm rounded-xl p-2 shadow-xl border border-slate-700">
      <Button
        onClick={onExecute}
        disabled={isExecuting || nodeCount === 0}
        className="gap-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white transition-all hover:scale-105"
        size="sm"
      >
        {isExecuting ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Executing...
          </>
        ) : (
          <>
            <Zap className="w-4 h-4" />
            Execute
          </>
        )}
      </Button>
      
      <Button
        onClick={onSave}
        variant="outline"
        size="sm"
        className="gap-2 bg-slate-700/50 border-slate-600 text-slate-200 hover:bg-slate-700 hover:border-slate-500 hover:text-white transition-all"
        disabled={nodeCount === 0}
      >
        <Save className="w-4 h-4" />
        Save
      </Button>

      <Button
        onClick={onReset}
        variant="outline"
        size="sm"
        className="gap-2 bg-slate-700/50 border-slate-600 text-slate-200 hover:bg-red-500/20 hover:border-red-500/50 hover:text-red-400 transition-all"
        disabled={nodeCount === 0}
      >
        <RotateCcw className="w-4 h-4" />
        Reset
      </Button>
    </div>
  );
};