import * as fcl from "@onflow/fcl";
import * as t from "@onflow/types";
import elliptic from "elliptic";
import { createHash } from "crypto";
  import fs from "fs";


export function configureFlow(network: "emulator" | "testnet" = "emulator") {
  if (network === "emulator") {
    fcl.config()
      .put("accessNode.api", "http://127.0.0.1:8888") // emulator
      .put("flow.network", "emulator");
  } else {
    fcl.config()
      .put("accessNode.api", "https://rest-testnet.onflow.org")
      .put("flow.network", "testnet")
      .put("discovery.wallet", "https://fcl-discovery.onflow.org/testnet/authn");
  }

  console.log(`✅ Flow configured for ${network}`);
}
const service_address = process.env.FLOW_ADDRESS!;
const private_key = process.env.FLOW_PRIVATE_KEY!;
const key_id = parseInt(process.env.FLOW_KEY_ID!);
const ec = new elliptic.ec("p256");
const key = ec.keyFromPrivate(Buffer.from(private_key, "hex"));

function sign(message: string) {
  const digest = createHash("sha3-256")
    .update(Buffer.from(message, "hex"))
    .digest();
  const sig = key.sign(digest);
  const n = 32;
  const r = sig.r.toArrayLike(Buffer, "be", n);
  const s = sig.s.toArrayLike(Buffer, "be", n);
  return Buffer.concat([r, s]).toString("hex");
}

export const serviceAuthz = (account: any) => ({
  ...account,
  addr: service_address,
  keyId: key_id,
  signingFunction: (signable: any) => ({
    addr: service_address,
    keyId: key_id,
    signature: sign(signable.message),
  }),
});

export async function executeCadenceTransaction(
  cadenceCode: string,
  args: ReturnType<typeof fcl.arg>[] = []
) {
  try {
  fs.writeFileSync("cadenceCode.cdc", cadenceCode);
  } catch (err) {
    console.error("Error writing Cadence code to file:", err);
  }
  const txId = await fcl
    .send([
      fcl.transaction(cadenceCode),
      fcl.args(args),
      fcl.proposer(serviceAuthz),
      fcl.payer(serviceAuthz),
      fcl.authorizations([serviceAuthz]),
      fcl.limit(999),
    ])
    .then(fcl.decode);
  const result = await fcl.tx(txId).onceSealed();
  return result;
}