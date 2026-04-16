import { NotFoundError } from '../../utils/AppError.js';
import * as repo from './product.repository.js';
import redis from '../../config/redis.js';
const CACHE_TTL = 60;

async function flushRedis() {
    const keys = await redis.keys('products:*');
    if (keys.length) {
        await redis.del(keys);
    }
}

export async function createProduct(payload) {
    await flushRedis();

    return repo.createProduct(payload);
}

export async function getProduct(id) {
    const product = await repo.getProductById(id);
    if (!product) throw new NotFoundError('Product not found');
    return product;
}

export async function listProducts(validatedQuery) {
    const { page, limit, sort, search, searchField, minPrice, maxPrice } = validatedQuery;
    const cacheKey = `products:${page}:${limit}:${sort}:${search}:${searchField}:${minPrice}:${maxPrice}`;

    const cached = await redis.get(cacheKey);
    if (cached) {
        return JSON.parse(cached);
    }

    const products = await repo.listProducts(validatedQuery);

    await redis.set(cacheKey, JSON.stringify(products), 'EX', CACHE_TTL);

    return products;
}

export async function updateProduct(id, payload) {
    const updated = await repo.updateProduct(id, payload);
    if (!updated) throw new NotFoundError('Product not found');

    await flushRedis();

    return updated;
}

export async function deleteProduct(id) {
    const deleted = await repo.deleteProduct(id);
    if (!deleted) throw new NotFoundError('Product not found');

    await flushRedis();

    return { deletedId: deleted.id };
}