import { Router } from 'express';
import * as controller from './order.controller.js';
import { validate } from '../../middlewares/validate.js';
import { createOrderBody } from './order.validation.js';
import { auth } from '../../middlewares/auth.js';


const router = Router();
router.post('/', auth, validate({ body: createOrderBody }), controller.create);

export default router;