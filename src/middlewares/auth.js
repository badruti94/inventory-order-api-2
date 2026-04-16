import jwt from 'jsonwebtoken';
import env from '../config/env.js';
import AppError, { ForbiddenError, UnauthorizedError } from '../utils/AppError.js';

export function auth(req, res, next) {
    const header = req.headers.authorization;

    if (!header || !header.startsWith('Bearer ')) {
        return next(new UnauthorizedError('Missing Authorization header'));
    }

    const token = header.slice('Bearer '.length);

    try {
        const payload = jwt.verify(token, env.jwtSecret);
        req.user = { id: payload.sub, role: payload.role };
        return next();
    } catch (error) {
        return next(new UnauthorizedError('Invalid or expired token'));
    }
}

export function requireRoles(...roles) {
    return (req, res, next) => {
        if (!req.user) return next(new UnauthorizedError('Unauthorized'));
        if (!roles.includes(req.user.role)) {
            return next(new ForbiddenError('Forbidden'));
        }
        next();
    };
}