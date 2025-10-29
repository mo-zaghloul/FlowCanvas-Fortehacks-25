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
      transaction(amount: UFix64) {
        prepare(acct: AuthAccount) {
          log("Source action: using ".concat(amount.toString()).concat(" FLOW from ").concat(acct.address.toString()))
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
