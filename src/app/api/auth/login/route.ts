import { NextRequest } from 'next/server';
import { apiSuccess, parseBody, withErrorHandler } from '@/middleware/api-middleware';
import { authService } from '@/services/auth.service';
import { loginSchema } from '@/schemas/auth.schema';

async function handler(req: NextRequest) {
  const body = await parseBody(req, loginSchema);
  const result = await authService.login(body);
  return apiSuccess(result, 200);
}

export const POST = withErrorHandler(handler as any);
