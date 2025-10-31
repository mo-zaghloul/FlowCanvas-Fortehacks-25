import * as fcl from "@onflow/fcl";
import * as t from "@onflow/types";

export const createProfile = async (name: string, age: number) => {
  const transaction = `
    import Profile from 0xProfile

    transaction(name: String, age: Int) {
      prepare(acct: AuthAccount) {
        Profile.createProfile(name: name, age: age)
      }
    }
  `;

  // Use the modern FCL mutate API
  const transactionId = await fcl.mutate({
    cadence: transaction,
    args: (arg: any, t: any) => [
      arg(name, t.String),
      arg(age, t.Int)
    ],
    limit: 1000
  });

  return fcl.tx(transactionId).onceSealed();
};