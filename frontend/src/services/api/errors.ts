// custom error classes
export class ApiError extends Error {
    constructor(
        message: string,
        public statusCode?: number,
        public code?: string,
        public details?: unknown
    ) {
        super(message);
        this.name = 'ApiError';
        Object.setPrototypeOf(this, ApiError.prototype);
    }
}

// network error class
export class NetworkError extends ApiError {
    constructor(message = 'Network error occurred') {
        super(message, 0, 'NETWORK_ERROR');
        this.name = 'NetworkError';
    }
}

// validation error class
export class ValidationError extends ApiError {
    constructor(message: string, details?: unknown) {
        super(message, 400, 'VALIDATION_ERROR', details);
        this.name = 'ValidationError';
    }
}

// authentication error class
export class AuthenticationError extends ApiError {
    constructor(message = 'Authentication required') {
        super(message, 401, 'AUTHENTICATION_ERROR');
        this.name = 'AuthenticationError';
    }
}

// not found error class
export class NotFoundError extends ApiError {
    constructor(message = 'Resource not found') {
        super(message, 404, 'NOT_FOUND');
        this.name = 'NotFoundError';
    }
}

// server error class
export class ServerError extends ApiError {
    constructor(message = 'Internal server error') {
        super(message, 500, 'SERVER_ERROR');
        this.name = 'ServerError';
    }
}
