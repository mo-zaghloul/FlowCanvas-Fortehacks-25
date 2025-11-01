
import "FungibleToken"
import "FlowToken"
import "USDC"
import "IncrementFiStakingConnectors"
import "IncrementFiSwapConnectors"
import FungibleTokenConnectors from 0xf8d6e0586b0a20c7

transaction(poolID: UInt64, maxAmount: UFix64, swapPath: [String]) {
    prepare(signer: AuthAccount) {
        let rewardsSource = IncrementFiStakingConnectors.PoolRewardsSource(
            userCertificate: signer.borrow<&AnyResource>(from: /storage/stakingCertificate)!,
            poolID: poolID,
            vaultType: Type<@FlowToken.Vault>(),
            overflowSinks: {},
            uniqueID: nil
        )

        let swapper = IncrementFiSwapConnectors.Swapper(
            path: swapPath,
            inVault: Type<@FlowToken.Vault>(),
            outVault: Type<@USDC.Vault>(),
            uniqueID: nil
        )

        let usdcVaultCap = signer.getCapability<{FungibleToken.Receiver}>(/public/usdcReceiver)
        let vaultSink = FungibleTokenConnectors.VaultSink(
            max: 1000.0,
            depositVault: usdcVaultCap,
            uniqueID: nil
        )

        let rewards <- rewardsSource.withdrawAvailable(maxAmount)
        let stableTokens <- swapper.swap(nil, inVault: <-rewards)
        vaultSink.depositCapacity(from: &stableTokens as &FungibleToken.Vault)
        
        if stableTokens.balance > 0.0 {
            signer.borrow<&USDC.Vault>(from: /storage/usdcVault)!
                .deposit(from: <-stableTokens)
        } else {
            destroy stableTokens
        }
    }
}