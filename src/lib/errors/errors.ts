import { AppError } from './app-error';

export class ValidationError extends AppError {
  public readonly details?: object;

  constructor(message: string, details?: object) {
    super(message, 400, 'VALIDATION_ERROR', true);
    this.details = details;
  }
}

export class UnauthorizedError extends AppError {
  public readonly details?: object;

  constructor(message: string = 'Unauthorized access', details?: object) {
    super(message, 401, 'UNAUTHORIZED', true);
    this.details = details;
  }
}

export class ForbiddenError extends AppError {
  public readonly details?: object;

  constructor(message: string = 'Forbidden access', details?: object) {
    super(message, 403, 'FORBIDDEN', true);
    this.details = details;
  }
}

export class NotFoundError extends AppError {
  public readonly details?: object;

  constructor(message: string = 'Resource not found', details?: object) {
    super(message, 404, 'NOT_FOUND', true);
    this.details = details;
  }
}

export class ConflictError extends AppError {
  public readonly details?: object;

  constructor(message: string = 'Resource conflict', details?: object) {
    super(message, 409, 'CONFLICT', true);
    this.details = details;
  }
}

export class RateLimitError extends AppError {
  public readonly details?: object;

  constructor(message: string = 'Too many requests', details?: object) {
    super(message, 429, 'RATE_LIMIT_EXCEEDED', true);
    this.details = details;
  }
}

export class PaymentError extends AppError {
  public readonly details?: object;

  constructor(message: string = 'Payment required or failed', details?: object) {
    super(message, 402, 'PAYMENT_ERROR', true);
    this.details = details;
  }
}

export class ExternalServiceError extends AppError {
  public readonly details?: object;

  constructor(message: string = 'External service error', details?: object) {
    super(message, 502, 'EXTERNAL_SERVICE_ERROR', true);
    this.details = details;
  }
}
