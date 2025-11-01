// backend/actions/stakeAction.ts
import { StakeNodeParams } from "../../types/nodeTypes";
export const generateStakeAction = (params: StakeNodeParams): any => {
  let cadenceTemplate = '';
  
  if (params.stakingType === 'node') {
    // Node Operator Staking
    cadenceTemplate = `
      import FlowStakingCollection from 0xFlowStakingCollection
      import FlowToken from 0xFlowToken
      import FungibleToken from 0xFungibleToken
      
      transaction(amount: UFix64) {
        let stakingCollectionRef: auth(FlowStakingCollection.CollectionOwner) &FlowStakingCollection.StakingCollection
        
        prepare(signer: auth(BorrowValue) &Account) {
          // Borrow reference to staking collection
          self.stakingCollectionRef = signer.storage.borrow<auth(FlowStakingCollection.CollectionOwner) &FlowStakingCollection.StakingCollection>(
            from: ${params.stakingCollectionPath || 'FlowStakingCollection.StakingCollectionStoragePath'}
          ) ?? panic("Could not borrow staking collection reference")
        }
        
        execute {
          // Stake new tokens for node
          self.stakingCollectionRef.stakeNewTokens(
            nodeID: "${params.nodeID}",
            delegatorID: nil,
            amount: amount
          )
        }
      }
    `;
  } else {
    // Delegator Staking
    cadenceTemplate = `
      import FlowStakingCollection from 0xFlowStakingCollection
      import FlowToken from 0xFlowToken
      import FungibleToken from 0xFungibleToken
      
      transaction(amount: UFix64) {
        let stakingCollectionRef: auth(FlowStakingCollection.CollectionOwner) &FlowStakingCollection.StakingCollection
        
        prepare(signer: auth(BorrowValue) &Account) {
          // Borrow reference to staking collection
          self.stakingCollectionRef = signer.storage.borrow<auth(FlowStakingCollection.CollectionOwner) &FlowStakingCollection.StakingCollection>(
            from: ${params.stakingCollectionPath || 'FlowStakingCollection.StakingCollectionStoragePath'}
          ) ?? panic("Could not borrow staking collection reference")
        }
        
        execute {
          // Stake new tokens for delegator
          self.stakingCollectionRef.stakeNewTokens(
            nodeID: "${params.nodeID}",
            delegatorID: ${params.delegatorID ? `UInt32(${params.delegatorID})` : 'nil'},
            amount: amount
          )
        }
      }
    `;
  }

//   return {
//     type: 'stake',
//     cadence: cadenceTemplate,
//     params: {
//       amount: params.amount
//     },
//     dependencies: ['FlowStakingCollection', 'FlowToken', 'FungibleToken']
//   };
    return cadenceTemplate;
};