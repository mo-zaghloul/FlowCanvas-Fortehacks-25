// backend/actions/workflowGenerator.ts
import { Bool } from "@onflow/types";
import { Workflow, WorkflowNode } from "../types/workflow-types";
import { generateNodeComponents } from "./nodeComponents";
import { TRANSACTION_TEMPLATE } from "./utils";
import { NodeComponents } from "../flow/nodeComponents";

export const generateUnifiedTransaction = (workflow: Workflow): any => {
  const nodeComponents = buildTransactionComponents(workflow);
  
  const unifiedCadence = `
    // Auto-generated unified transaction
    ${nodeComponents.imports.join('\n')}

    transaction(${nodeComponents.parameters.join(', ')}) {
      prepare(signer: auth(BorrowValue) &Account) {
      ${nodeComponents.declarations.join('\n')}

      ${nodeComponents.executeBlocks.join('\n')}
        }
    }
  `;
    console.log('Unified Cadence Transaction:\n', unifiedCadence);  
    return unifiedCadence;
  
//     return {
//         cadence: unifiedCadence,
//         params: extractParameters(workflow),
//     dependencies: extractDependencies(workflow)
//   };
};

const buildTransactionComponents = (workflow: Workflow) => {
  const imports = new Set<string>();
  const declarations: string[] = [];
//   const prepareBlocks: string[] = [];
  const executeBlocks: string[] = [];
  const parameters: string[] = [];

  let currentNode = workflow.nodes.find((n: WorkflowNode) => n.id === workflow.entryPoint);
  
  while (currentNode?.id != null) {
    // imports, execute, parameters from node
    const nodeComponents = generateNodeComponents(currentNode);
    
    // Merge imports
    nodeComponents.imports.forEach(imp => imports.add(imp));

    // Add declarations
    nodeComponents.declarations.forEach(decl => declarations.push(decl));
    
    // Add prepare blocks
    // let prepare = false;
    // if (nodeComponents.prepare) {
    //   prepareBlocks.push(nodeComponents.prepare);
    // }

    // Add execute blocks
    let execute = false;
    if (nodeComponents.execute) {
        // log 
        console.log("Execute block found:", nodeComponents.execute);

        if (!execute) {
            execute = true;
            executeBlocks.push("execute {\n");
        }
        executeBlocks.push(nodeComponents.execute);
    }
    if (execute) {
        executeBlocks.push("}");
    }

    // Add parameters
    nodeComponents.parameters.forEach(param => parameters.push(param));

    // Move to next node
    currentNode = workflow.nodes.find((n: WorkflowNode) => n.id === currentNode!.nextNodeId);
  }

  return { imports: Array.from(imports), declarations: Array.from(declarations), /*prepare,*/ executeBlocks, parameters };
};