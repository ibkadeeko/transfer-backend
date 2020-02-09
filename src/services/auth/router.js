import { Router } from 'express';
import { signup, login } from './index';
import { validator } from '../../middlewares';
import { createUser as signupValidationSchema, login as loginValidationSchema } from './validation';

const router = Router();

router.use('/signup', validator(signupValidationSchema), signup);
router.use('/login', validator(loginValidationSchema), login);

export default router;
