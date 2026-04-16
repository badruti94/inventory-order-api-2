import { DataTypes } from 'sequelize';
import sequelize from '../sequelize.js';

const User = sequelize.define('User', {
    id: {type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true},
    name: { type: DataTypes.TEXT, allowNull: false },
    email: { type: DataTypes.TEXT, allowNull: false, unique: true },
    password: { type: DataTypes.TEXT, allowNull: false },
    role: { type: DataTypes.TEXT, allowNull: false }
}, {
    tableName: 'users',
    underscored: true,
    timestamps: false,
});

export default User;