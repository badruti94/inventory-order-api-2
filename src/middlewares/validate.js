import { ZodError } from 'zod';
import { ValidationError } from '../utils/AppError.js';

export function validate({ body, query, params }) {
    return (req, _res, next) => {
        try {
            if (body) req.validatedBody = body.parse(req.body);
            if (query) req.validatedQuery = query.parse(req.query);
            if (params) req.validatedParams = params.parse(req.params);
            return next();
        } catch (error) {
            if (error instanceof ZodError) {
                const details = error.issues.map((i) => ({
                    path: i.path.join('.'),
                    message: i.message,
                    code: i.code,
                }));

                return next(
                    new ValidationError('Validation failed', { issues: details })
                );
            }
            return next(error);
        }
    };
}