import { z } from 'zod';

export const productIdParams = z.object({
    id: z.string('id is required').uuid('id must be uuid'),
});

const SORT_FIELDS = ['created_at', 'name', 'price'];
const SEARCH_FIELDS = ['name'];

export const listProductsQuery = z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),
    sort: z
        .string()
        .optional()
        .default('created_at:desc')
        .refine((v) => {
            const [field, dir] = v.split(':');
            return SORT_FIELDS.includes(field) && ['asc', 'desc'].includes((dir ?? '').toLowerCase());
        }, 'sort must be like "name:asc" or "price:desc"'),
    search: z.string().trim().min(1).optional(),
    searchField: z
        .string()
        .optional()
        .default('name')
        .refine((v) => SEARCH_FIELDS.includes(v), 'invalid searchField'),
    minPrice: z.coerce.number().nonnegative().optional(),
    maxPrice: z.coerce.number().nonnegative().optional(),
}).refine((v) => {
    if (v.minPrice !== undefined && v.maxPrice !== undefined) return v.minPrice <= v.maxPrice;
    return true;
}, 'minPrice must be <= maxPrice');

export const createProductBody = z.object({
    name: z.string('name is required').min(2).max(200),
    price: z.coerce.number().nonnegative('price must be >= 0'),
    stock: z.coerce.number().int().nonnegative('stock must be >= 0'),
});

export const updateProductBody = z.object({
    name: z.string('name is required').min(2).max(200).optional(),
    price: z.coerce.number().nonnegative('price must be >= 0').optional(),
    stock: z.coerce.number().int().nonnegative('stock must be >= 0').optional(),
})
    .refine((v) => Object.keys(v).length > 0, 'at least one field is required');