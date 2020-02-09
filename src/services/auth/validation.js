import { body } from 'express-validator';
import PasswordValidator from 'password-validator';

import { getUserByPhone, checkUserExists } from '../../resources/users/DAL';

const schema = new PasswordValidator();

schema
  .is()
  .min(6) // Minimum length 6
  .is()
  .max(100) // Maximum length 100
  .has()
  .letters() // Must have letters
  .has()
  .digits() // Must have digits
  .has()
  .not()
  .spaces() // Should not have spaces
  .is()
  .not()
  .oneOf(['Passw0rd', 'Password123', 'password']);

/**
 * Function to sanitize phone number
 *
 * @param {string} number Phone number
 *
 * @returns {string} Phone number in format +2348031112222
 */
const formatPhoneNumber = number => {
  switch (number.length) {
    case 10:
      return `+234${number}`;
    case 11:
      return `+234${number.substr(1)}`;
    case 13:
      return `+${number}`;
    case 14:
      return number;
    default:
      return number;
  }
};

export const login = [
  body('password')
    .trim()
    .exists({ checkFalsy: true, checkNull: true })
    .withMessage('Password is required'),
  body('email')
    .trim()
    .exists({ checkFalsy: true, checkNull: true })
    .withMessage('E-mail is required')
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
];

export const createUser = [
  body('firstName')
    .trim()
    .exists({ checkFalsy: true, checkNull: true })
    .withMessage('First name is required')
    .matches(/^[a-zA-Z]+(\s[a-zA-Z]+)*$/)
    .withMessage('First Name Input is Invalid')
    .customSanitizer(name => name.toLowerCase()),
  body('lastName')
    .trim()
    .exists({ checkFalsy: true, checkNull: true })
    .withMessage('Last name is required')
    .matches(/^[a-zA-Z]+(\s[a-zA-Z]+)*$/)
    .withMessage('Last Name Input is Invalid')
    .customSanitizer(name => name.toLowerCase()),
  body('email')
    .trim()
    .exists({ checkFalsy: true, checkNull: true })
    .withMessage('E-mail is required')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please Enter a valid email')
    .customSanitizer(value => value.toLowerCase())
    .custom(async value => {
      const user = await checkUserExists(value);
      if (!user) {
        return true;
      }
      throw new Error('E-mail already in use');
    }),
  body('phone')
    .trim()
    .exists({ checkFalsy: true, checkNull: true })
    .withMessage('Mobile number is required')
    .isString()
    .withMessage('Phone number should be of type string')
    .isMobilePhone('en-NG')
    .withMessage('Please enter a valid Nigerian Phone number')
    .customSanitizer(value => formatPhoneNumber(value))
    .custom(async value => {
      const user = await getUserByPhone(value);
      if (!user) {
        return true;
      }
      throw new Error('Phone number already in use');
    }),
  body('password')
    .trim()
    .exists({ checkFalsy: true, checkNull: true })
    .withMessage('Password is required')
    .custom(value => {
      const isValid = schema.validate(value);
      if (isValid) {
        return true;
      }
      throw new Error(
        'Password should contain at least one letter, one digit and min 6 characters long'
      );
    }),
];
