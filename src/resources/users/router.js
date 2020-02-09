import { Router } from 'express';
import { getOne } from './controller';
import { getOneUserSchema } from './validation';
import { validator } from '../../middlewares';

const router = Router();

// /api/v1/users/:id
router.route('/:id').get(validator(getOneUserSchema), getOne);

export default router;
