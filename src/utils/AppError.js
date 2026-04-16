import { errorCode, httpStatus } from "../constants/httpStatus.js";

export default class AppError extends Error{
    constructor(message, statusCode = 500, code = 'INTERNAL_ERROR', details = null){
        super(message);
        this.name = 'AppError';
        this.statusCode = statusCode;
        this.code = code;
        this.details = details;
    }
}

export class NotFoundError extends AppError {
    constructor(message = 'Not found', details = null){
        super(message, httpStatus.NOT_FOUND, errorCode.NOT_FOUND, details);
    }
}

export class ValidationError extends AppError{
    constructor(message = 'Validation failed', details = null){
        super(message, httpStatus.BAD_REQUEST, errorCode.VALIDATION_ERROR, details);
    }
}

export class UnauthorizedError extends AppError{
    constructor(message = 'Invalid credentials', details = null){
        super(message, httpStatus.UNAUTHORIZED, errorCode.UNAUTHORIZED, details);
    }
}

export class ForbiddenError extends AppError{
    constructor(message = 'Forbidden', details = null){
        super(message, httpStatus.FORBIDDEN, errorCode.FORBIDDEN, details);
    }
}

export class ConflictError extends AppError{
    constructor(message = 'Already used', details = null){
        super(message, httpStatus.CONFLICT, errorCode.CONFLICT, details);
    }
}