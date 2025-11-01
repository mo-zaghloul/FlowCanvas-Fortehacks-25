// backend/actions/nodeComponents.ts
import { WorkflowNode } from "../types/workflow-types";

// Define interface for consistent return type
export interface NodeComponents {
  imports: string[];
  declarations: string[];
//   prepare: string | null;
  execute: string | null;
  parameters: string[];
}

export const generateNodeComponents = (node: WorkflowNode): NodeComponents => {
  switch (node.type) {
    case 'source':
      return generateSourceComponents(node.params);
    // case 'stake':
    //   return generateStakeComponents(node.params);
    case 'sink':
      return generateSinkComponents(node.params);
    default:
      return {
        imports: [],
        declarations: [],
        // prepare: null,
        execute: null,
        parameters: []
      };
  }
};

// Source Node Components
const generateSourceComponents = (params: WorkflowNode['params']): NodeComponents => {
  return {
    imports: [
      'import FungibleToken from 0xee82856bf20e2aa6',
      'import FlowToken from 0x0ae53cb6e3f42a79'
    ],
    declarations: ['var withdrawnTokens: @FungibleToken.Vault?'], // <-- NEW DECLARATION ARRAY
//     prepare: `
//     prepare(signer: auth(BorrowValue) &Account) {
//       let sourceVaultRef = signer.storage.borrow<auth(FungibleToken.Withdraw) &{FungibleToken.Vault}>(
//         from: ${params.vaultPath || '/storage/flowTokenVault'}
//       ) ?? panic("Source vault not found")
//       this.withdrawnTokens <- sourceVaultRef.withdraw(amount: sourceAmount) // <--- ASSIGN TO GLOBAL VARIABLE
//     //   let withdrawnTokens <- sourceVaultRef.withdraw(amount: sourceAmount)
// }
//     `,
    execute: `
    let sourceVaultRef = signer.storage.borrow<auth(FungibleToken.Withdraw) &{FungibleToken.Vault}>(
        from: ${params.vaultPath || '/storage/flowTokenVault'}
      ) ?? panic("Source vault not found")
      this.withdrawnTokens <-! sourceVaultRef.withdraw(amount: sourceAmount) // <--- ASSIGN TO GLOBAL VARIABLE
`,
    parameters: ['sourceAmount: UFix64']
  };
};

// Sink Node Components
const generateSinkComponents = (params: WorkflowNode['params']): NodeComponents => {
  return {
    imports: [
      'import FungibleToken from 0xee82856bf20e2aa6',
      'import FlowToken from 0x0ae53cb6e3f42a79'
    ],
    declarations: [' '], // No new declarations needed here
    // prepare: null,
    execute: `let sinkVaultRef = getAccount(${params.recipientAddress}).capabilities.borrow<&{FungibleToken.Receiver}>(
     ${params.receiverPath || '/public/flowTokenReceiver'}
    ) ?? panic("Sink receiver not found")

    sinkVaultRef.deposit(from: <- self.withdrawnTokens!) // <--- TAKE FROM GLOBAL VARIABLE
    `,
    parameters: ['recipientAddress: Address']
  };
};

// Stake Node Components  
// const generateStakeComponents = (params: WorkflowNode['params']): NodeComponents => {
//   return {
//     imports: [
//       'import FlowStakingCollection from 0xf8d6e0586b0a20c7'
//     ],
//     declarations: [], // Add empty declarations array
//     prepare: `
//       // STAKE: Get staking collection reference
//       let stakingCollectionRef = signer.storage.borrow<auth(FlowStakingCollection.CollectionOwner) &FlowStakingCollection.StakingCollection>(
//         from: ${params.stakingCollectionPath || 'FlowStakingCollection.StakingCollectionStoragePath'}
//       ) ?? panic("Staking collection not found")
//     `,
//     execute: `
//       // STAKE: Execute staking with tokens from previous step
//       stakingCollectionRef.stakeNewTokens(
//         nodeID: "${params.nodeID}",
//         delegatorID: ${params.delegatorID ? `UInt32(${params.delegatorID})` : 'nil'},
//         amount: stakeAmount
//       )
//     `,
//     parameters: ['stakeAmount: UFix64']
//   };
// };