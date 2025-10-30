import express from "express";
import { getExecutionOrder, SingleNodeExecution, Workflow } from "../services/workflowParser";
import { executeAction } from "../services/forteActions";
import { receiveMessageOnPort } from "node:worker_threads";
import { executeCadenceTransaction } from "../flow/fclConfig";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { node, address } = req.body;
    const cadenceCode = `
      import FungibleToken from 0xee82856bf20e2aa6
      import FlowToken from 0x0ae53cb6e3f42a79

      transaction(amount: UFix64) {
        prepare(acct: auth(BorrowValue) &Account) {
          log("🚀 Initializing Source Action for ".concat(amount.toString()).concat(" FLOW"))

          // Borrow withdraw capability from user's vault
          let vaultRef = acct.storage.borrow<auth(FungibleToken.Withdraw) &{FungibleToken.Vault}>(from: /storage/flowTokenVault)
            ?? panic("Vault not found!")

          // Withdraw tokens directly from the vault
          let withdrawn <- vaultRef.withdraw(amount: amount)
          log("✅ Withdrawn ".concat(amount.toString()).concat(" FLOW successfully"))

          // Get the recipient's public account object
          let recipient = getAccount(0xf8d6e0586b0a20c7)

          // Get a reference to the recipient's Receiver using capabilities
          let receiverRef = recipient.capabilities.borrow<&{FungibleToken.Receiver}>(/public/flowTokenReceiver)
            ?? panic("Could not borrow receiver reference")

          // Deposit the withdrawn tokens in the recipient's vault
          receiverRef.deposit(from: <-withdrawn)
          
          log("✅ Successfully transferred ".concat(amount.toString()).concat(" FLOW"))
        }
      }
    `;

    const result = await executeCadenceTransaction(cadenceCode, node.params);
    res.json({ success: true, tx: result });
  } catch (err: any) {
    res.json({ success: false, error: err.message });
  }
});

export default router;