import { Play, Save, RotateCcw, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ToolbarProps {
  onExecute: () => void;
  onSave: () => void;
  onReset: () => void;
  isExecuting: boolean;
}

export const Toolbar = ({ onExecute, onSave, onReset, isExecuting }: ToolbarProps) => {
  return (
    <div className="absolute top-4 right-4 z-10 flex gap-2 bg-card/95 backdrop-blur-sm rounded-xl p-2 shadow-elevated border border-border">
      <Button
        onClick={onExecute}
        disabled={isExecuting}
        className="gap-2 bg-gradient-to-r from-primary to-accent hover:opacity-90"
        size="sm"
      >
        {isExecuting ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Executing...
          </>
        ) : (
          <>
            <Play className="w-4 h-4" />
            Execute
          </>
        )}
      </Button>
      
      <Button
        onClick={onSave}
        variant="outline"
        size="sm"
        className="gap-2"
      >
        <Save className="w-4 h-4" />
        Save
      </Button>

      <Button
        onClick={onReset}
        variant="outline"
        size="sm"
        className="gap-2 hover:bg-destructive hover:text-destructive-foreground"
      >
        <RotateCcw className="w-4 h-4" />
        Reset
      </Button>
    </div>
  );
};
