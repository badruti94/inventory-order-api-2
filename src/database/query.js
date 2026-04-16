import logger from '../config/logger.js';
import sequelize from './sequelize.js';
import { QueryTypes } from 'sequelize';

const SLOW_QUERY_MS = 200;

export async function query(text, {replacements = {}, transaction, plain = false} = {}, meta = {}) {
    const start = Date.now();
    try {
        const result = await sequelize.query(text, {
            type: QueryTypes.SELECT,
            replacements,
            transaction,
            plain,
        });
        const durationMs = Date.now() - start;

        if (durationMs >= SLOW_QUERY_MS) {
            logger.warn('Slow DB query', { durationMs, text, meta });
        }

        return result;
    } catch (err) {
        logger.error('DB query error', {
            message: err.message,
            stack: err.stack,
            text,
            meta,
        });
        throw err;
    }
}