import sequelize from '../../database/sequelize.js';
import { Op, QueryTypes } from 'sequelize';
import { Product, Order, OrderItem } from '../../database/models/index.js';

export async function createOrder(t, { userId, totalPrice }) {
    const order = await Order.create(
        { user_id: userId, total_price: totalPrice },
        { transaction: t }
    );

    return order;
}

export async function insertOrderItem(t, { orderId, productId, quantity, price }) {
    const item = await OrderItem.create(
        { order_id: orderId, product_id: productId, quantity, price },
        { transaction: t }
    );

    return item;
}

/**
 * Ambil product + lock row supaya aman dari race condition.
 * SELECT ... FOR UPDATE => stok gak bisa dibaca/diupdate barengan sampai transaksi selesai.
 */
export async function getProductForUpdate(t, productId) {
    const sql = `
    SELECT id, price, stock
    FROM products
    WHERE id = :productId
    FOR UPDATE
  `;

    const row = await sequelize.query(sql, {
        type: QueryTypes.SELECT,
        replacements: { productId },
        transaction: t,
        plain: true,
    });

    return row ?? null;
}

export async function decrementStock(t, productId, quantity) {
    const [affected] = await Product.update(
        { stock: sequelize.literal(`stock - ${Number(quantity)}`) },
        {
            where: {
                id: productId,
                stock: { [Op.gte]: quantity },
            },
            transaction: t,
        }
    );

    if (affected === 0) return null;

    const updated = await Product.findByPk(productId, {
        attributes: ['id', 'stock'],
        transaction: t,
        lock: t.LOCK.UPDATE,
    });

    return updated ? updated.get({ plain: true }) : { id: productId };
}