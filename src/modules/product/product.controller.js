import { httpStatus } from '../../constants/httpStatus.js';
import { ok } from '../../utils/httpResponse.js';
import * as service from './product.service.js';

export async function create(req, res, next) {
    const product = await service.createProduct(req.validatedBody);
    res.status(httpStatus.CREATED).json(ok(product));
}

export async function getById(req, res, next) {
    const product = await service.getProduct(req.validatedParams.id);
    res.json(ok(product));
}

export async function list(req, res, next) {
    const products = await service.listProducts(req.validatedQuery);
    res.json(ok(products));
}

export async function update(req, res, next) {
    const product = await service.updateProduct(req.validatedParams.id, req.validatedBody);
    res.json(ok(product));
}

export async function remove(req, res, next) {
    const result = await service.deleteProduct(req.validatedParams.id);
    res.json(ok(result));
}