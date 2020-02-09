import express from 'express';
import { protect } from '../services/auth';
import authRoutes from '../services/auth/router';
import userRoutes from '../resources/users/router';
import transactionRoutes from '../resources/transactions/router';

const router = express.Router();

router.use(authRoutes);
router.use('/users', protect, userRoutes);
router.use('/transactions', protect, transactionRoutes);

export default router;
