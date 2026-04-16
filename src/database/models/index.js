import Product from './Product.js';
import User from './User.js';
import Order from './Order.js';
import OrderItem from './OrderItem.js';

Order.hasMany(OrderItem, { foreignKey: 'order_id' });
OrderItem.belongsTo(Order, { foreignKey: 'order_id' });

Product.hasMany(OrderItem, { foreignKey: 'product_id' });
OrderItem.belongsTo(Product, { foreignKey: 'product_id' });

User.hasMany(Order, { foreignKey: 'user_id' });
Order.belongsTo(User, { foreignKey: 'user_id' });

export {
    Product,
    User,
    Order,
    OrderItem,
};