import axios from "axios";
import * as fcl from "@onflow/fcl";
import * as t from "@onflow/types";

export async function executeAction(type: string, params: any) {
  switch (type) {
    case "swap":
      return await axios.post("https://api.forte.xyz/swap", params);
    case "stake":
      return await axios.post("https://api.forte.xyz/stake", params);
    case "transfer":
      return await axios.post("https://api.forte.xyz/transfer", params);
    case "source":
        return await sourceAction(type, params, params.address);
    default:
      throw new Error(`Unknown action type: ${type}`);
  }
}

export function buildSourceCadence(token: string) {
  // Example Cadence placeholder
  return `
  transaction(amount: UFix64) {
    prepare(acct: AuthAccount) {
      log("Source action: using ".concat(amount.toString()).concat(" ${token} from ").concat(acct.address.toString()))
    }
  }
  `;
}
export async function sourceAction(type: string, params: any, address: string) {
  let cadenceCode = "";

  switch (type) {
    case "source":
      cadenceCode = `
        transaction(amount: UFix64) {
          prepare(acct: AuthAccount) {
            log("Source action: using ".concat(amount.toString()).concat(" ${params.token} from ").concat(acct.address.toString()))
          }
        }
      `;
      break;

    default:
      throw new Error(`Unknown action type: ${type}`);
  }

}