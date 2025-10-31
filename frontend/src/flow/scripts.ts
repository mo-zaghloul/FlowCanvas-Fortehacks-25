import * as fcl from '@onflow/fcl';
import * as t from '@onflow/types';

export const getFlowBalance = async (address: string): Promise<string> => {
  const script = `
    import FlowToken from 0x7e60df042a9c0868
    import FungibleToken from 0x9a0766d93b6608b7

    pub fun main(address: Address): UFix64 {
      let account = getAccount(address)

      let vaultRef = account.getCapability(/public/flowTokenBalance)
        .borrow<&FlowToken.Vault{FungibleToken.Balance}>()
        ?? panic("Could not borrow Balance reference to the Vault")

      return vaultRef.balance
    }
  `;

  const result = await fcl.send([
    fcl.script(script),
    fcl.args([fcl.arg(address, t.Address)]),
  ]).then(fcl.decode);

  return result;
};