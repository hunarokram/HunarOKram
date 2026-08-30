import { NextRequest } from 'next/server';
import { apiSuccess, parseBody, withErrorHandler } from '@/middleware/api-middleware';
import { authService } from '@/services/auth.service';
import { registerSchema } from '@/schemas/auth.schema';

async function handler(req: NextRequest) {
  const body = await parseBody(req, registerSchema);
  const result = await authService.register(body);
  return apiSuccess(result, 201);
}

export const POST = withErrorHandler(handler as any);
