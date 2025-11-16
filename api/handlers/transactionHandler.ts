import { query } from "../utils/db";
import { getAccount } from "./accountHandler";

export const withdrawal = async (accountID: string, amount: number) => {
  const account = await getAccount(accountID);
  account.amount -= amount;

  if (account.amount < 0 && account.type != 'credit') {
    throw new Error('Insufficient funds for withdrawal')
  }

  if (account.type == 'credit' && Math.abs(account.amount) > account.credit_limit) {
    throw new Error(`Sorry, you cannot exceed your credit limit of ${account.credit_limit}`)
  }

  // if the withdrawal amount is not valid, send an appropriate error message
  // we probably shouldn't all the user to withdraw 0 or negative numbers
  if (amount <= 0) {
    throw new Error('Withdrawal amount must be greater than $0')
  }

  // cant withdraw more than 200 in 1 request
  if (amount > 200) {
    throw new Error('Withdrawal amount cannot exceed $200 for a single transaction')
  }

  // withdrawal amount must be a multiple of 5 dollars
  if (amount % 5 != 0) {
    throw new Error('Withdrawal amount must be able to be dispensed in $5 bills')
  }

  // for restricting how much can be withdrawn per day, I decided to store the date as a string and then check the current date string against all withdrawals from that day when doing a new withdrawal to determine if
  // we had reached the $400 limit yet.
  const latestWithdrawal = await query(`select amount from transaction_history where account_number=$1 and type='withdrawal' and transaction_time=$2`, [accountID, new Date().toLocaleDateString()])

  // get the total amount withdrawn, including what we are looking to withdraw now and if it is over 400 dollars, throw an error
  const totalAmount = latestWithdrawal.rows.reduce((sum, current) => sum+current.amount, 0) + amount
  console.log('totalAmount: ', totalAmount)
  if (totalAmount > 400) {
    throw new Error("Cannot Withdraw more than $400 per day")
  }

  const res = await query(`
    UPDATE accounts
    SET amount = $1 
    WHERE account_number = $2`,
    [account.amount, accountID]
  );

  // store this withdrawal transaction
  const transactionRes = await query (`insert into transaction_history (account_number, amount, type, transaction_time) values ($1,$2,$3, $4)`, [accountID, amount, 'withdrawal',  new Date().toLocaleDateString()])

  if (res.rowCount === 0) {
    throw new Error("Transaction failed");
  }

  if (transactionRes.rowCount === 0) {
    throw new Error ("Failed to log transaction")
  }

  return account;
}

export const deposit = async (accountID: string, amount: number) => {
  const account = await getAccount(accountID);

  if (amount > 1000) {
    throw new Error('The maximum deposit amount for a single transaction is $1000')
  }

  account.amount += amount;

  if (account.amount > 0 && account.type == 'credit') {
    throw new Error('For credit accounts, you cannot deposit more than it would take to zero out your account')
  }

  const res = await query(`
    UPDATE accounts
    SET amount = $1 
    WHERE account_number = $2`,
    [account.amount, accountID]
  );

  if (res.rowCount === 0) {
    throw new Error("Transaction failed");
  }

  return account;
}