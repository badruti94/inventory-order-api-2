import { NotFoundError, ValidationError } from '../../utils/AppError.js';
import * as repo from './order.repository.js';
import sequelize from '../../database/sequelize.js';
import { getChannel } from '../../config/rabbitmq.js';

export async function createOrder({ userId, items }) {
    return await sequelize.transaction(async (t) => {
        let totalPrice = 0;

        // lock + cek stok + hitung total
        const enriched = [];
        for (const it of items) {
            const product = await repo.getProductForUpdate(t, it.productId);
            if (!product) throw new NotFoundError('Product not found', { productId: it.productId });

            if (product.stock < it.quantity) {
                throw new ValidationError('Insufficient stock', {
                    productId: it.productId,
                    available: product.stock,
                    requested: it.quantity,
                });
            }

            const lineTotal = Number(product.price) * it.quantity;
            totalPrice += lineTotal;

            enriched.push({
                productId: it.productId,
                quantity: it.quantity,
                price: product.price,
            });
        }

        const order = await repo.createOrder(t, { userId, totalPrice });

        for (const it of enriched) {
            await repo.insertOrderItem(t, {
                orderId: order.id,
                productId: it.productId,
                quantity: it.quantity,
                price: it.price,
            });

            const updated = await repo.decrementStock(t, it.productId, it.quantity);
            if (!updated) {
                throw new ValidationError('Insufficient stock', {
                    productId: it.productId,
                    requested: it.quantity,
                });
            }
        }

        const channel = getChannel();

        channel.publish(
            'order.exchange',
            'order.created',
            Buffer.from(JSON.stringify({
                orderId: order.id,
                userId,
                totalPrice,
            })),
            { persistent: true }
        );

        return { order, items: enriched };
    });
}