import { DataTypes } from 'sequelize';
import sequelize from '../sequelize.js';

const Product = sequelize.define('Product', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    price: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
    stock: { type: DataTypes.INTEGER, allowNull: false },
}, {
    tableName: 'products',
    underscored: true,
    timestamps: false,
});

export default Product;