import { httpStatus } from '../../constants/httpStatus.js';
import { ok } from '../../utils/httpResponse.js'
import * as service from './order.service.js';

export async function create(req, res, next) {
    const result = await service.createOrder({
        userId: req.user.id,
        items: req.validatedBody.items,
    });
    res.status(httpStatus.CREATED).json(ok(result));
}