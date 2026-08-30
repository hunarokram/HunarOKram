import { NextRequest } from 'next/server';
import { apiSuccess, withErrorHandler } from '@/middleware/api-middleware';
import { authService } from '@/services/auth.service';

async function handler(req: NextRequest) {
  await authService.logout();
  return apiSuccess({ success: true }, 200);
}

export const POST = withErrorHandler(handler as any);
