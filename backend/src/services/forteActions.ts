import axios from "axios";

export async function executeAction(type: string, params: any) {
  switch (type) {
    case "swap":
      return await axios.post("https://api.forte.xyz/swap", params);
    case "stake":
      return await axios.post("https://api.forte.xyz/stake", params);
    case "transfer":
      return await axios.post("https://api.forte.xyz/transfer", params);
    case "source":
        return axios("https://api.forte.xyz/source", params);
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
