import { Sequelize } from 'sequelize';
import env from '../config/env.js';
import logger from '../config/logger.js';

const sequelize = new Sequelize(env.dbName, env.dbUser, env.dbPassword, {
    host: env.dbHost,
    port: env.dbPort,
    dialect: 'postgres',
    logging: (msg) => logger.debug(msg),
    pool: {
        max: env.dbMaxPool ?? 10,
        min: 0,
        idle: 30000,
        acquire: 2000,
    },
});

export default sequelize;