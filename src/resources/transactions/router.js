import { Router } from 'express';
import {
  getAllTransactions,
  getOneTransaction,
  creditTransaction,
  debitTransaction,
} from './controller';

const router = Router();

// api/v1/transactions
router.route('/').get(getAllTransactions);
router.route('/:id').get(getOneTransaction);
router.route('/credit').post(creditTransaction);
router.route('/debit').post(debitTransaction);

export default router;
