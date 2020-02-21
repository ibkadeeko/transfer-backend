import { Router } from 'express';
import { getOne } from './controller';

const router = Router();

// /api/v1/users/:id
router.route('/').get(getOne);

export default router;
