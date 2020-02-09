import { successResponse, errorResponse } from '../../utils/responseHandlers';

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
 * Transfer money in to your online account
 *
 * @param {Object} request express request object
 * @param {Object} response express response object
 * @param {Function} next express next function
 *
 * @returns {Promise<Function | Object>} returns one of express next function or response object
 */
export const creditTransaction = async (request, response, next) => {
  try {
    // Transfer money into your online wallet
  } catch (error) {
    return errorResponse(next, error.message);
  }
};

/**
 * Transfer money out of your online account
 *
 * @param {Object} request express request object
 * @param {Object} response express response object
 * @param {Function} next express next function
 *
 * @returns {Promise<Function | Object>} returns one of express next function or response object
 */
export const debitTransaction = async (request, response, next) => {
  try {
    // Transfer money out of your online wallet
  } catch (error) {
    return errorResponse(next, error.message);
  }
};
