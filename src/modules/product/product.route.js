import { Router } from 'express';
import * as controller from './product.controller.js';
import { auth, requireRoles } from '../../middlewares/auth.js';
import { validate } from '../../middlewares/validate.js';
import { createProductBody, listProductsQuery, productIdParams, updateProductBody } from './product.validation.js';

const router = Router();

router.get('/', validate({ query: listProductsQuery }), controller.list);
router.get('/:id', validate({ params: productIdParams }), controller.getById);

router.post(
    '/',
    auth,
    requireRoles('admin', 'staff'),
    validate({ body: createProductBody }),
    controller.create
);

router.patch(
    '/:id',
    auth,
    requireRoles('admin', 'staff'),
    validate({ params: productIdParams, body: updateProductBody }),
    controller.update
);
router.delete(
    '/:id',
    auth,
    requireRoles('admin', 'staff'),
    validate({ params: productIdParams }),
    controller.remove
);


export default router;