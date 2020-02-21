import { successResponse, errorResponse, AppError } from '../../utils/responseHandlers';
import { getUserById, checkUserExists } from '../users/DAL';
import { makeTransaction } from './DAL';

/**
 * Gets all transactions performed by a user
 *
 * @param {Object} request express request object
 * @param {Object} response express response object
 * @param {Function} next express next function
 *
 * @returns {Promise<Function | Object>} returns one of express next function or response object
 */
export const getAllTransactions = async (request, response, next) => {
  try {
    // Get all transactions by a user
  } catch (error) {
    return errorResponse(next, error.message);
  }
};

/**
 * Gets a single transaction performed by a user based on the transaction ID
 *
 * @param {Object} request express request object
 * @param {Object} response express response object
 * @param {Function} next express next function
 *
 * @returns {Promise<Function | Object>} returns one of express next function or response object
 */
export const getOneTransaction = async (request, response, next) => {
  try {
    // Get One transactions by a user by the transaction ID
  } catch (error) {
    return errorResponse(next, error.message);
  }
};

/**
 * Transfer money into or out of your online account
 *
 * @param {Object} request express request object
 * @param {Object} response express response object
 * @param {Function} next express next function
 *
 * @returns {Promise<Function | Object>} returns one of express next function or response object
 */
export const createTransaction = async (request, response, next) => {
  try {
    // Transfer money into your online wallet
    const { id: userId } = request.user;
    const user = await getUserById(userId);
    const { type, amount, ...details } = request.body;

    const sufficientFunds = user.account.balance >= amount;

    if (type === 'transfer') {
      if (user.email === details.receiver) {
        throw new AppError('cannot transfer money to yourself', 400);
      }
      if (!sufficientFunds) {
        throw new AppError('insufficient funds', 400);
      }
      const { _id: receiverId } = await checkUserExists(details.receiver);
      const transactionDetails = {
        amount,
        type,
        customer: receiverId,
        createdBy: userId,
      };
      await makeTransaction(transactionDetails);
      return successResponse(response, 'transaction successful', 200);
    } else {
      if (type === 'withdrawal' && !sufficientFunds) {
        throw new AppError('insufficient funds', 400);
      }
      const transactionDetails = {
        amount,
        type,
        createdBy: userId,
        bank: {
          name: details.bankName,
          accountName: details.bankAccountName,
          accountNumber: details.bankAccountNumber,
        },
      };
      await makeTransaction(transactionDetails);
      return successResponse(response, 'transaction successful', 200);
    }
  } catch (error) {
    return next(error);
  }
};
