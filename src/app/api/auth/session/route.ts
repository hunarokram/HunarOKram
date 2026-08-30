import { NextRequest } from 'next/server';
import { apiSuccess, withErrorHandler } from '@/middleware/api-middleware';
import { authService } from '@/services/auth.service';

async function handler(req: NextRequest) {
  const result = await authService.validateSession();
  return apiSuccess(result, 200);
}

export const GET = withErrorHandler(handler as any);
