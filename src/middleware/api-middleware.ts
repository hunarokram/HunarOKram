import { NextResponse } from 'next/server';
import { ZodSchema, ZodError } from 'zod';
import { AppError } from '@/lib/errors/app-error';
import { logger } from '@/lib/logger';
import { connectToDatabase } from '@/lib/db/connection';

/** Standard API success response */
export function apiSuccess<T>(data: T, status = 200, meta?: Record<string, unknown>) {
  const body: Record<string, unknown> = { success: true, data };
  if (meta) body.meta = meta;
  return NextResponse.json(body, { status });
}

/** Standard API error response */
export function apiError(
  code: string,
  message: string,
  status: number,
  requestId?: string,
  details?: Record<string, string[]>
) {
  return NextResponse.json(
    {
      success: false,
      error: {
        code,
        message,
        ...(details && { details }),
        requestId: requestId ?? crypto.randomUUID(),
      },
    },
    { status }
  );
}

/** Handle any thrown error and return a safe API response */
export function handleApiError(error: unknown): NextResponse {
  const requestId = crypto.randomUUID();

  if (error instanceof AppError) {
    logger.warn('Operational error', {
      requestId,
      code: error.code,
      message: error.message,
      statusCode: error.statusCode,
    });

    return apiError(error.code, error.message, error.statusCode, requestId);
  }

  if (error instanceof ZodError) {
    const details: Record<string, string[]> = {};
    for (const issue of error.issues) {
      const path = issue.path.join('.') || '_root';
      if (!details[path]) details[path] = [];
      details[path].push(issue.message);
    }

    return apiError('VALIDATION_ERROR', 'Invalid request data', 400, requestId, details);
  }

  // Unknown/programming error — log full details, return safe message
  logger.error('Unhandled error', {
    requestId,
    error: error instanceof Error ? error.message : String(error),
    stack: error instanceof Error ? error.stack : undefined,
  });

  return apiError(
    'INTERNAL_SERVER_ERROR',
    `An unexpected error occurred: ${error instanceof Error ? error.message : String(error)}`,
    500,
    requestId
  );
}

/** Validate request body against a Zod schema */
export async function parseBody<T>(request: Request, schema: ZodSchema<T>): Promise<T> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    throw new AppError('Request body must be valid JSON', 400, 'INVALID_JSON');
  }
  return schema.parse(body);
}

/** Validate search params against a Zod schema */
export function parseSearchParams<T>(url: URL, schema: ZodSchema<T>): T {
  const params: Record<string, string> = {};
  url.searchParams.forEach((value, key) => {
    params[key] = value;
  });
  return schema.parse(params);
}

/**
 * Wraps an API route handler with standard error handling.
 * Use this to avoid try/catch boilerplate in every route.
 */
export function withErrorHandler(
  handler: (request: Request, context: { params: Promise<Record<string, string>> }) => Promise<NextResponse>
) {
  return async (request: Request, context: { params: Promise<Record<string, string>> }): Promise<NextResponse> => {
    try {
      await connectToDatabase();
      return await handler(request, context);
    } catch (error) {
      return handleApiError(error);
    }
  };
}
