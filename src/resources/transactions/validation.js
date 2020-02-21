import { body } from 'express-validator';
import { checkUserExists } from '../users/DAL';

export const createTransactionSchema = [
  body('amount')
    .trim()
    .exists({ checkFalsy: true, checkNull: true })
    .withMessage('amount is required')
    .isNumeric()
    .isInt()
    .withMessage('input a valid number')
    .isInt({ min: 100, max: 1000000 })
    .withMessage('Amount must be a value between 100 and 1000000'),
  body('type')
    .trim()
    .not()
    .isEmpty()
    .withMessage('transaction type should not be Empty')
    .isIn(['deposit', 'withdrawal', 'transfer'])
    .withMessage('transaction type is invalid'),
  body('receiver')
    .if(body('type').equals('transfer'))
    .trim()
    .not()
    .isEmpty()
    .withMessage('receiver email is required')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please Enter a valid email')
    .customSanitizer(value => value.toLowerCase())
    .custom(async value => {
      const user = await checkUserExists(value);
      if (user) {
        return true;
      }
      throw new Error('User with this email does not exist');
    }),
  body('bankName')
    .if(
      body('type')
        .not()
        .equals('transfer')
    )
    .trim()
    .not()
    .isEmpty()
    .withMessage('bank name is required')
    .matches(/^[a-zA-Z]+(\s[a-zA-Z]+)*$/)
    .withMessage('bank name is Invalid')
    .customSanitizer(name => name.toLowerCase()),
  body('bankAccountName')
    .if(
      body('type')
        .not()
        .equals('transfer')
    )
    .trim()
    .not()
    .isEmpty()
    .withMessage('bank account name is required')
    .matches(/^[a-zA-Z]+(\s[a-zA-Z]+)*$/)
    .withMessage('bank name is Invalid')
    .customSanitizer(name => name.toLowerCase()),
  body('bankAccountNumber')
    .if(
      body('type')
        .not()
        .equals('transfer')
    )
    .trim()
    .not()
    .isEmpty()
    .withMessage('bank account number is required')
    .isString()
    .withMessage('bank account number should be of type string')
    .matches(/^[0-9]{10}$/, 'gi')
    .withMessage('input a valid account number'),
];
