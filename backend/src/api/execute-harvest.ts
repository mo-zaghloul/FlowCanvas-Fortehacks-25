import express from "express";
import { executeCadenceTransaction } from "../flow/fclConfig";
import { cadenceHarvestTransaction } from "../workflow-templates/cadenceHarvestTransaction";
import { 
  HarvestRequestBody, 
  HarvestResponse, 
  WorkflowNode, 
  isSourceNode,
  isSwapperNode,
  isSinkNode 
} from "../types/harvest-types";
import * as fcl from "@onflow/fcl";
import { UInt64, UFix64, String as FlowString, Array as FlowArray, Address } from "@onflow/types";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { workflow } = req.body as HarvestRequestBody;
    
    if (!workflow || !workflow.nodes || workflow.nodes.length < 3) {
      throw new Error("Invalid workflow: requires source, swapper, and sink nodes");
    }

    const sourceNode = workflow.nodes.find(n => n.type === 'source');
    const swapperNode = workflow.nodes.find(n => n.type === 'swapper');
    const sinkNode = workflow.nodes.find(n => n.type === 'sink');

    if (!sourceNode || !swapperNode || !sinkNode) {
      throw new Error("Missing required nodes: source, swapper, or sink");
    }

    if (!isSourceNode(sourceNode) || !isSwapperNode(swapperNode) || !isSinkNode(sinkNode)) {
      throw new Error("Invalid node type configuration");
    }

    const cadenceCode = cadenceHarvestTransaction;
    const args = [
      fcl.arg(sourceNode.params.pool_id, UInt64),
      fcl.arg('100.0', UFix64), // Default max amount
      fcl.arg([swapperNode.params.in, swapperNode.params.out], FlowArray(FlowString)),
      fcl.arg(sinkNode.params.max_capacity, UFix64),
      fcl.arg(sourceNode.params.user_address, Address)
    ];

    const result = await executeCadenceTransaction(cadenceCode, args);
    
    const response: HarvestResponse = { 
      success: true, 
      tx: result.toString()
    };
    
    res.json(response);
  } catch (err: any) {
    const errorResponse: HarvestResponse = {
      success: false,
      error: err.message
    };
    res.status(400).json(errorResponse);
  }
});

export default router;