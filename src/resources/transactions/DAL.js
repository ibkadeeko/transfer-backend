import { Transaction } from './model';

/**
 * Creates a new user
 * @param {Object} transactionDetails Details for transaction to be created
 *
 * @returns {Promise<Object>} User Details
 */
export const makeTransaction = async transactionDetails => {
  const data = await Transaction.create(transactionDetails);
  return data;
};
