import { Router } from 'express';
import * as controller from './auth.controller.js';
import { validate } from '../../middlewares/validate.js';
import { loginSchema,  refreshSchema,  registerSchema } from './auth.validation.js';
import { loginLimiter, refreshLimiter } from '../../middlewares/rateLimit.js';

const router = Router();

router.post('/register', validate({ body: registerSchema }), controller.register);
router.post('/login', loginLimiter,  validate({ body: loginSchema }), controller.login);
router.post('/refresh', refreshLimiter,  validate({ body: refreshSchema }), controller.refresh);


export default router;