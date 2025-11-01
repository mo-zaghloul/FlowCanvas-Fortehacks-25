// types/node-types.ts
export interface StakeNodeParams {
  // Staking Configuration
  stakingType: 'delegator' | 'node';
  nodeID: string;              // Validator node ID
  delegatorID?: string;        // Only for delegator type
  
  // Amount Configuration
  amountType: 'fixed' | 'percentage' | 'max';
  amount: number;
  
  // Token Source
  sourceType: 'locked' | 'unlocked' | 'reward';
  lockedAccountPath?: string;  // "/storage/lockedTokens"
  
  // Staking Collection
  stakingCollectionPath: string; // "/storage/flowStakingCollection"
  
  // Execution Context
  signer: 'connected' | 'service';
}

// Source Node Parameters
export interface SourceNodeParams {
  // Token Selection
  tokenAddress: string;        // Contract address (e.g., "0x1654653399040a61" for FlowToken)
  tokenType: 'FLOW' | 'FUSD' | 'USDC' | 'CUSTOM';
  customTokenIdentifier?: string; // For custom tokens
  
  // Amount Configuration
  amountType: 'fixed' | 'percentage' | 'max';
  amount: number;              // Fixed amount or percentage
  decimals: number;            // Token decimals (FLOW=8, others may vary)
  
  // Source Account
  sourceAccount: 'connected' | 'specific' | 'vault';
  specificAddress?: string;    // If using specific address
  vaultPath?: string;          // Storage path (e.g., "/storage/flowTokenVault")
  
  // Execution Context
  signer: 'connected' | 'service' | 'custom';
  authRequirements: string[];  // Required capabilities
}

export interface NodeData {
  id: string;
  type: string;
  params: SourceNodeParams;
  position: { x: number; y: number };
}

// types/workflow-types.ts
export interface Workflow {
  id: string;
  name: string;
  nodes: NodeData[];
  edges: Array<{
    id: string;
    source: string;
    target: string;
    sourceHandle: string;
    targetHandle: string;
  }>;
}