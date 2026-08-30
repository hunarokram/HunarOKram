import { AppError } from './app-error';
import { logger } from '../logger';

/**
 * Interface representing the standardized error response format.
 */
export interface ErrorResponse {
  body: {
    success: boolean;
    error: {
      code: string;
      message: string;
      statusCode: number;
      details?: unknown;
      requestId?: string;
    };
  };
  status: number;
}

/**
 * Centralized error handler that formats exceptions into standardized API responses.
 * 
 * @param error - The caught error object
 * @param requestId - Optional request ID to include in the response and logs
 * @returns A standardized ErrorResponse object
 */
export function createErrorResponse(error: unknown, requestId?: string): ErrorResponse {
  const finalRequestId = requestId || crypto.randomUUID();

  // Handle known application errors
  if (error instanceof AppError) {
    const errorDetails = (error as any).details;
    
    // We log non-operational errors or 5xx errors
    if (!error.isOperational || error.statusCode >= 500) {
      logger.error('Operational error or 5xx status', {
        error: error.message,
        code: error.code,
        requestId: finalRequestId,
        stack: error.stack,
      });
    } else {
      logger.debug('AppError occurred', {
        error: error.message,
        code: error.code,
        requestId: finalRequestId,
      });
    }

    return {
      status: error.statusCode,
      body: {
        success: false,
        error: {
          code: error.code,
          message: error.message,
          statusCode: error.statusCode,
          details: errorDetails,
          requestId: finalRequestId,
        },
      },
    };
  }

  // Handle Zod Validation Errors
  // We check by name to avoid explicitly importing Zod if it's not installed yet,
  // making this file pure TypeScript while maintaining the required behavior.
  if (typeof error === 'object' && error !== null && (error as any).name === 'ZodError') {
    logger.debug('Validation error', {
      error: 'ZodError',
      requestId: finalRequestId,
    });
    
    return {
      status: 400,
      body: {
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid input data',
          statusCode: 400,
          details: (error as any).errors || error,
          requestId: finalRequestId,
        },
      },
    };
  }

  // Handle Unknown / Uncaught Errors
  logger.error('Unhandled exception', {
    error: error instanceof Error ? error.message : String(error),
    stack: error instanceof Error ? error.stack : undefined,
    requestId: finalRequestId,
  });

  return {
    status: 500,
    body: {
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'An unexpected error occurred',
        statusCode: 500,
        requestId: finalRequestId,
      },
    },
  };
}
