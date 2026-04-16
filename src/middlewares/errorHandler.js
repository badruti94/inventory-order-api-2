import logger from "../config/logger.js";
import env from "../config/env.js";
import AppError from "../utils/AppError.js";
import { fail } from "../utils/httpResponse.js";

export default function errorHandler(err, req, res, next) {
    // Normalize error
    const isAppError = err instanceof AppError;

    const statusCode = isAppError ? err.statusCode : 500;
    const code = isAppError ? err.code : 'INTERNAL_ERROR';
    const message = isAppError ? err.message : 'Something went wrong';

    // Log with context
    logger.error('Request error', {
        requestId: req.requestId,
        code,
        statusCode,
        message: err.message,
        method: req.method,
        path: req.originalUrl,
        // stack hanya untuk dev biar aman (prod jangan bocorin detail)
        stack: env.nodeEnv === 'production' ? undefined : err.stack,
    });

    // Response (jangan bocorin stack ke user)
    res.status(statusCode).json(fail(
        code,
        message,
        req.requestId,
        err.details,
        isAppError
    ));
}