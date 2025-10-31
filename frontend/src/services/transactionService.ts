// Alternative src/services/transactionService.ts with type casting
import * as fcl from "@onflow/fcl";
import * as t from "@onflow/types";

// Create a profile transaction
export const createProfile = async (name: string, description: string = "") => {
  try {
    const transaction = `
      import Profile from 0xProfile

      transaction(name: String, description: String) {
        prepare(acct: AuthAccount) {
          if !acct.getCapability<&Profile.Base{Profile.Public}>(/public/Profile).check() {
            let profile <- Profile.createProfile(name: name, description: description)
            acct.save(<-profile, to: /storage/Profile)
            acct.link<&Profile.Base{Profile.Public}>(/public/Profile, target: /storage/Profile)
          }
        }
      }
    `;

    const transactionId = await fcl.mutate({
      cadence: transaction,
      args: (arg: any, t: any) => [
        arg(name, t.String),
        arg(description, t.String)
      ],
      limit: 1000
    });

    return transactionId;
  } catch (error) {
    console.error("Error creating profile:", error);
    throw error;
  }
};

// Update profile transaction
export const updateProfile = async (name: string, description: string) => {
  try {
    const transaction = `
      import Profile from 0xProfile

      transaction(name: String, description: String) {
        prepare(acct: AuthAccount) {
          let profile = acct.borrow<&Profile.Base>(from: /storage/Profile)
            ?? panic("Could not borrow a reference to the Profile")
          profile.setName(name: name)
          profile.setDescription(description: description)
        }
      }
    `;

    const transactionId = await fcl.mutate({
      cadence: transaction,
      args: (arg: any, t: any) => [
        arg(name, t.String),
        arg(description, t.String)
      ],
      limit: 1000
    });

    return transactionId;
  } catch (error) {
    console.error("Error updating profile:", error);
    throw error;
  }
};