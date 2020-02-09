import { param } from 'express-validator';

export const getOneUserSchema = [
  param('id')
    .trim()
    .exists({ checkFalsy: true, checkNull: true })
    .withMessage('Id parameter is required')
    .isMongoId()
    .withMessage('Please enter a valid id'),
];
