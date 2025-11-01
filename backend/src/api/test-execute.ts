import express from "express";
import { Workflow, WorkflowNode } from "../types/workflow-types";
import { executeCadenceTransaction } from "../flow/fclConfig";
import { generateUnifiedTransaction } from "../flow/generateUnifiedTransaction";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { Workflow, address } = req.body;
    const cadenceCode = generateUnifiedTransaction(Workflow);

    const result = await executeCadenceTransaction(cadenceCode, []);
    res.json({ success: true, tx: result });
  } catch (err: any) {
    res.json({ success: false, error: err.message });
  }
});

export default router;