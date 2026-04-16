import AppError, { NotFoundError } from "../utils/AppError.js";

export default function notFound(req, res, next) {
    next(new NotFoundError(`Route not found: ${req.method} ${req.originalUrl}`));
}