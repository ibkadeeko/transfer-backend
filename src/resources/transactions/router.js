import { Router } from 'express';
import { getAllTransactions, getOneTransaction, createTransaction } from './controller';
import { validator } from '../../middlewares';
import { createTransactionSchema } from './validation';

const router = Router();

// api/v1/transactions
router
  .route('/')
  .get(getAllTransactions)
  .post(validator(createTransactionSchema), createTransaction);
router.route('/:id').get(getOneTransaction);

export default router;
