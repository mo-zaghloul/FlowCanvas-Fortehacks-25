import { ArrowRightLeft, Coins, Send, Gift, Clock, ChevronLeft, ChevronRight, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { ActionBlockType } from "@/types/workflow";
import { Button } from "@/components/ui/button";
import { useState } from "react";

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
    color: "from-amber-500 to-yellow-500",
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
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div 
      className={`
        relative bg-slate-800 border-r border-slate-700 p-4 ${isCollapsed ? 'overflow-hidden' : 'overflow-y-auto'} transition-all duration-300 ease-in-out
        ${isCollapsed ? 'w-20' : 'w-72'}
      `}
    >
      <div className="space-y-4">
        {/* Header */}
        <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
          {!isCollapsed && (
            <div>
              <h2 className="text-lg font-bold mb-1 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Forte Visual Builder
              </h2>
              <p className="text-xs text-slate-400">
                Click icons to add
              </p>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className={`h-8 w-8 text-slate-400 hover:text-slate-200 hover:bg-slate-700 ${isCollapsed ? 'absolute left-1/2 -translate-x-1/2 top-1 z-25' : ''}`}
          >
            {isCollapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
          </Button>
        </div>

        {/* Action Blocks */}
        <div className="space-y-2">
          {!isCollapsed && (
            <h3 className="text-sm font-semibold text-slate-300 mb-3">Action Blocks</h3>
          )}
          <div className={`space-y-2 ${isCollapsed ? 'flex flex-col items-center' : ''}`}>
            {actionBlocks.map((block) => {
              const Icon = iconMap[block.icon];
              return (
                <Button
                  key={block.type}
                  variant="outline"
                  className={`
                    justify-start h-auto transition-all group relative
                    ${isCollapsed ? 'w-20 h-20 p-0 justify-center bg-transparent border-transparent hover:bg-slate-700/10' : 'w-full p-3 bg-slate-700/50 border-slate-600 hover:bg-slate-700 hover:border-slate-500 hover:shadow-lg'}
                  `}
                  onClick={() => onAddNode(block.type, block.label, block.defaultParams)}
                >
                  {isCollapsed ? (
                    // Show the colored pill (no outer grey background) when collapsed
                    <div className={`rounded-lg bg-gradient-to-br ${block.color} flex items-center justify-center w-12 h-12`}> 
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                  ) : (
                    <div className={`rounded-lg bg-gradient-to-br ${block.color} flex items-center justify-center group-hover:scale-110 transition-transform w-10 h-10 rounded-lg mr-3`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                  )}
                  
                  {!isCollapsed && (
                    <div className="flex-1 text-left min-w-0">
                      <div className="flex flex-col justify-center">
                        <div className="font-semibold text-base text-slate-200 truncate">{block.label}</div>
                        <div className="text-sm text-slate-400 capitalize">{block.type}</div>
                      </div>
                    </div>
                  )}

                  {/* Tooltip for collapsed state */}
                  {isCollapsed && (
                    <div className="absolute left-full ml-2 px-2 py-1 bg-slate-700 text-slate-200 text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50 shadow-lg border border-slate-600">
                      {block.label}
                    </div>
                  )}
                </Button>
              );
            })}
          </div>
        </div>

        {/* How to Use - Only show when expanded */}
        {!isCollapsed && (
          <div className="pt-4 border-t border-slate-700">
            <div className="rounded-lg bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-slate-600 p-4">
              <h4 className="text-sm font-semibold text-slate-200 mb-2">How to use</h4>
              <ul className="text-xs text-slate-400 space-y-1">
                <li>• Click blocks to add to canvas</li>
                <li>• Connect nodes with arrows</li>
                <li>• Edit node parameters</li>
                <li>• Click Execute to run workflow</li>
              </ul>
            </div>
          </div>
        )}

        {/* Quick Stats - Only show when expanded */}
        {!isCollapsed && (
          <div className="pt-4 border-t border-slate-700">
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-slate-300 mb-2">Workflow Tips</h4>
              <div className="text-xs text-slate-400 space-y-2">
                <div className="flex items-center gap-2 p-2 rounded bg-slate-700/30">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Start with a Schedule node</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded bg-slate-700/30">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Connect from left to right</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded bg-slate-700/30">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span>Test with small amounts first</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Mini version for collapsed state */}
        {isCollapsed && (
          <div className="pt-4 border-t border-slate-700">
            <div className="text-center">
              <div className="flex justify-center space-x-1">
                <div className="w-1 h-1 bg-slate-600 rounded-full"></div>
                <div className="w-1 h-1 bg-slate-600 rounded-full"></div>
                <div className="w-1 h-1 bg-slate-600 rounded-full"></div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};