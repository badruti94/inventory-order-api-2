import { DataTypes } from 'sequelize';
import sequelize from '../sequelize.js';

const Order = sequelize.define('Order', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    user_id: { type: DataTypes.UUID, allowNull: false },
    total_price: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
}, {
    tableName: 'orders',
    underscored: true,
    timestamps: false,
});

export default Order;