import { DataTypes } from 'sequelize';
import sequelize from '../sequelize.js';

const OrderItem = sequelize.define('OrderItem', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    order_id: { type: DataTypes.UUID, allowNull: false },
    product_id: { type: DataTypes.UUID, allowNull: false },
    quantity: { type: DataTypes.INTEGER, allowNull: false },
    price: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
}, {
    tableName: 'order_items',
    underscored: true,
    timestamps: false,
});

export default OrderItem;