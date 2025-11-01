const cadenceHarvestTransaction = `
import "FungibleToken"
import "FlowToken"
import "USDC"
import "IncrementFiStakingConnectors"
import "IncrementFiSwapConnectors"
import FungibleTokenConnectors from 0xf8d6e0586b0a20c7

transaction(
    poolID: UInt64,
    maxAmount: UFix64,
    swapPath: [String]
) {
    prepare(signer: AuthAccount) {
        
        // 1. SOURCE: Claim rewards from staking pool
        let rewardsSource = IncrementFiStakingConnectors.PoolRewardsSource(
            userCertificate: signer.borrow<&AnyResource>(from: /storage/stakingCertificate)!,
            poolID: poolID,
            vaultType: Type<@FlowToken.Vault>(),
            overflowSinks: {},
            uniqueID: nil
        )

        // 2. SWAPPER: Convert FLOW → USDC
        let swapper = IncrementFiSwapConnectors.Swapper(
            path: swapPath,
            inVault: Type<@FlowToken.Vault>(),
            outVault: Type<@USDC.Vault>(),
            uniqueID: nil
        )

        // 3. SINK: Deposit USDC to user's vault
        let usdcVaultCap = signer.getCapability<{FungibleToken.Receiver}>(/public/usdcReceiver)
        let vaultSink = FungibleTokenConnectors.VaultSink(
            max: 1000.0,
            depositVault: usdcVaultCap,
            uniqueID: nil
        )

        // EXECUTE WORKFLOW
        // Step 1: Withdraw rewards
        let rewards <- rewardsSource.withdrawAvailable(maxAmount)
        
        // Step 2: Swap FLOW → USDC
        let stableTokens <- swapper.swap(nil, inVault: <-rewards)
        
        // Step 3: Deposit to vault
        vaultSink.depositCapacity(from: &stableTokens as &FungibleToken.Vault)
        
        // Clean up any leftover tokens
        if stableTokens.balance > 0.0 {
            signer.borrow<&USDC.Vault>(from: /storage/usdcVault)!
                .deposit(from: <-stableTokens)
        } else {
            destroy stableTokens
        }
    }
}
`