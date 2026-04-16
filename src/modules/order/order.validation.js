import { z } from 'zod';

export const createOrderBody = z.object({
    items: z
    .array(
        z.object({
            productId: z.string('productId is required').uuid('productId must be uuid'),
            quantity: z.coerce.number('quantity is required and must be number').int().min(1, 'quantity must be >= 1'),
        })
    )
    .min(1, 'items must be a non-empty array'),
});