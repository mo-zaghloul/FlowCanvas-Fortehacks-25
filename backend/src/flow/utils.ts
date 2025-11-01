export const TRANSACTION_TEMPLATE = {
  start: `transaction(amount: UFix64) {
  prepare(acct: auth(BorrowValue) &Account) {`,
  end: `  }
}`
};