import express from "express";
import { getExecutionOrder, Workflow } from "../services/workflowParser";
import { executeAction } from "../services/forteActions";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const workflow: Workflow = req.body;
    const orderedNodes = getExecutionOrder(workflow);

    const results = [];
    for (const node of orderedNodes) {
      // Resolve parameters (replace {{variables}} with actual values)
      // const resolvedParams = resolveParameters(node.data.params, context);
      
      // // Execute the node's Cadence transaction
      // const result = await executeCadenceTransaction(
      //   getCadenceTemplate(node.type), 
      //   resolvedParams
      // );
      const result = await executeAction(node.type, node.params);
      results.push({ id: node.id, type: node.type, status: "success", result });
    }

    res.json({ success: true, results });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
