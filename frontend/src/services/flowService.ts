// src/services/flowService.ts
import * as fcl from "@onflow/fcl";
import * as t from "@onflow/types";

// Query the blockchain - Get account info
export const getAccount = async (address: string) => {
  try {
    const account = await fcl.send([
      fcl.getAccount(address)
    ]).then(fcl.decode);
    
    return account;
  } catch (error) {
    console.error("Error fetching account:", error);
    throw error;
  }
};

// Query Flow balance
export const getFlowBalance = async (address: string): Promise<string> => {
  try {
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

    const balance = await fcl.send([
      fcl.script(script),
      fcl.args([fcl.arg(address, t.Address)])
    ]).then(fcl.decode);

    return balance.toString();
  } catch (error) {
    console.error("Error fetching Flow balance:", error);
    throw error;
  }
};

// Check if user has a profile
export const checkProfile = async (address: string): Promise<boolean> => {
  try {
    const script = `
      import Profile from 0xProfile

      pub fun main(address: Address): Bool {
        return getAccount(address).getCapability<&Profile.Base{Profile.Public}>(/public/Profile)
          .check()
      }
    `;

    const hasProfile = await fcl.send([
      fcl.script(script),
      fcl.args([fcl.arg(address, t.Address)])
    ]).then(fcl.decode);

    return hasProfile;
  } catch (error) {
    console.error("Error checking profile:", error);
    return false;
  }
};