// backend/actions/sourceAction.ts
import { SourceNodeParams } from "../../types/nodeTypes";
export const generateSourceAction = (params: SourceNodeParams): any => {
  const baseTemplate = `
    import FungibleToken from 0xFungibleToken
    import FlowToken from 0xFlowToken
    
    transaction(amount: UFix64) {
      prepare(signer: auth(Storage, BorrowValue) &Account) {
        let vaultRef = signer.storage.borrow<auth(FungibleToken.Withdraw) &{FungibleToken.Vault}>(
          ${params.vaultPath || '/storage/flowTokenVault'}
        ) ?? panic("Vault not found")
        
        let source = FungibleTokenConnectors.VaultSource(
          min: 0.0, 
          withdrawVault: vaultRef, 
          uniqueID: nil
        )
        
        let withdrawn <- source.withdrawAvailable(amount)
        log("✅ Withdrawn ".concat(amount.toString()).concat(" ").concat("${params.amount} ${params.tokenType} successfully"))
    }
  `;
  
  // return {
  //   type: 'source',
  //   cadence: baseTemplate,
  //   params: {
  //     amount: params.amount
  //   }
  // };
  return baseTemplate;
};
