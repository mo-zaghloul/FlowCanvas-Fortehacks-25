<<<<<<< HEAD
import { Play, Save, RotateCcw, Loader2 } from "lucide-react";
=======
// components/Toolbar.tsx
import { Play, Save, RotateCcw, Loader2, Zap } from "lucide-react";
>>>>>>> 8843aa9 (Maintaining performance, enhancing styles and adding Landing page)
import { Button } from "@/components/ui/button";

interface ToolbarProps {
  onExecute: () => void;
  onSave: () => void;
  onReset: () => void;
  isExecuting: boolean;
<<<<<<< HEAD
}

export const Toolbar = ({ onExecute, onSave, onReset, isExecuting }: ToolbarProps) => {
  return (
    <div className="absolute top-4 right-4 z-10 flex gap-2 bg-card/95 backdrop-blur-sm rounded-xl p-2 shadow-elevated border border-border">
      <Button
        onClick={onExecute}
        disabled={isExecuting}
        className="gap-2 bg-gradient-to-r from-primary to-accent hover:opacity-90"
=======
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
>>>>>>> 8843aa9 (Maintaining performance, enhancing styles and adding Landing page)
        size="sm"
      >
        {isExecuting ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Executing...
          </>
        ) : (
          <>
<<<<<<< HEAD
            <Play className="w-4 h-4" />
=======
            <Zap className="w-4 h-4" />
>>>>>>> 8843aa9 (Maintaining performance, enhancing styles and adding Landing page)
            Execute
          </>
        )}
      </Button>
      
      <Button
        onClick={onSave}
        variant="outline"
        size="sm"
<<<<<<< HEAD
        className="gap-2"
=======
        className="gap-2 bg-slate-700/50 border-slate-600 text-slate-200 hover:bg-slate-700 hover:border-slate-500 hover:text-white transition-all"
        disabled={nodeCount === 0}
>>>>>>> 8843aa9 (Maintaining performance, enhancing styles and adding Landing page)
      >
        <Save className="w-4 h-4" />
        Save
      </Button>

      <Button
        onClick={onReset}
        variant="outline"
        size="sm"
<<<<<<< HEAD
        className="gap-2 hover:bg-destructive hover:text-destructive-foreground"
=======
        className="gap-2 bg-slate-700/50 border-slate-600 text-slate-200 hover:bg-red-500/20 hover:border-red-500/50 hover:text-red-400 transition-all"
        disabled={nodeCount === 0}
>>>>>>> 8843aa9 (Maintaining performance, enhancing styles and adding Landing page)
      >
        <RotateCcw className="w-4 h-4" />
        Reset
      </Button>
    </div>
  );
<<<<<<< HEAD
};
=======
};
>>>>>>> 8843aa9 (Maintaining performance, enhancing styles and adding Landing page)
