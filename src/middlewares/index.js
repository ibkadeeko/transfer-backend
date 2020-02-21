import { validationResult } from 'express-validator';
import { errorResponse } from '../utils/responseHandlers';

/**
 * Function to validate request input and check validation result
 *
 * @param {Array} schema - schema to be validated
 *
 * @returns {Array} array of validation schema and middleware to check validation result
 */
export const validator = schema => {
  /**
   * Middleware to check validation results
   *
   * @param {Object} req - express request object
   * @param {Object} res - express response object
   * @param {Function} next - express next function
   *
   * @returns {Function} next function
   */
  const validationCheck = (req, res, next) => {
    const errors = validationResult(req);
    const hasErrors = !errors.isEmpty();

    if (hasErrors) {
      const arrayOfErrors = Object.values(errors.mapped()).map(value => value.msg);
      return errorResponse(next, arrayOfErrors[0], 422);
    }

    return next();
  };

  return [schema, validationCheck];
};
