import { httpStatus } from '../../constants/httpStatus.js';
import { ok } from '../../utils/httpResponse.js'
import * as service from './auth.service.js';

export async function register(req, res) {
    const result = await service.register(req.validatedBody);
    res.status(httpStatus.CREATED).json(ok(result));
}

export async function login(req, res) {
    const result = await service.login(req.validatedBody);
    res.json(ok(result));
}

export async function refresh(req, res, next) {
    const result = await service.refresh(req.validatedBody);
    res.json(ok(result));
}