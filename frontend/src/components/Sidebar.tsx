import { ArrowRightLeft, Coins, Send, Gift, Clock } from "lucide-react";
import { ActionBlockType } from "@/types/workflow";
import { Button } from "@/components/ui/button";

const actionBlocks: ActionBlockType[] = [
  {
    type: "swap",
    label: "Swap Tokens",
    icon: "ArrowRightLeft",
    color: "from-blue-500 to-cyan-500",
    defaultParams: { tokenIn: "FLOW", tokenOut: "USDC", amount: "10" },
  },
  {
    type: "stake",
    label: "Stake",
    icon: "Coins",
    color: "from-purple-500 to-pink-500",
    defaultParams: { amount: "auto", validator: "default" },
  },
  {
    type: "transfer",
    label: "Transfer",
    icon: "Send",
    color: "from-green-500 to-emerald-500",
    defaultParams: { to: "0x...", amount: "1", token: "FLOW" },
  },
  {
    type: "claim",
    label: "Claim Rewards",
    icon: "Gift",
    color: "from-orange-500 to-yellow-500",
    defaultParams: { vault: "default" },
  },
  {
    type: "schedule",
    label: "Schedule",
    icon: "Clock",
    color: "from-indigo-500 to-purple-500",
    defaultParams: { interval: "24h", repeat: "true" },
  },
];

const iconMap: Record<string, any> = {
  ArrowRightLeft,
  Coins,
  Send,
  Gift,
  Clock,
};

interface SidebarProps {
  onAddNode: (type: string, label: string, params?: Record<string, string>) => void;
}

export const Sidebar = ({ onAddNode }: SidebarProps) => {
  return (
    <div className="w-72 bg-card border-r border-border p-4 overflow-y-auto">
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-bold mb-1 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Forte Visual Builder
          </h2>
          <p className="text-xs text-muted-foreground">
            Drag blocks to canvas or click to add
          </p>
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-foreground/80 mb-3">Action Blocks</h3>
          {actionBlocks.map((block) => {
            const Icon = iconMap[block.icon];
            return (
              <Button
                key={block.type}
                variant="outline"
                className="w-full justify-start h-auto p-3 hover:shadow-md transition-all group"
                onClick={() => onAddNode(block.type, block.label, block.defaultParams)}
              >
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${block.color} flex items-center justify-center mr-3 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div className="text-left">
                  <div className="font-medium text-sm">{block.label}</div>
                  <div className="text-xs text-muted-foreground capitalize">{block.type}</div>
                </div>
              </Button>
            );
          })}
        </div>

        <div className="pt-4 border-t border-border">
          <div className="rounded-lg bg-gradient-to-br from-primary/10 to-accent/10 p-4">
            <h4 className="text-sm font-semibold mb-2">How to use</h4>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• Click blocks to add to canvas</li>
              <li>• Connect nodes with arrows</li>
              <li>• Edit node parameters</li>
              <li>• Click Execute to run workflow</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
