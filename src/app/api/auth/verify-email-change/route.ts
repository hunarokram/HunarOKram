import { NextRequest } from 'next/server';
import { apiSuccess, parseBody, withErrorHandler } from '@/middleware/api-middleware';
import { authService } from '@/services/auth.service';
import { requireAuth } from '@/lib/auth/guard';
import { z } from 'zod';

const verifySchema = z.object({
  code: z.string().length(6)
});

async function handler(req: NextRequest) {
  const auth = await requireAuth();
  const { code } = await parseBody(req, verifySchema);
  const result = await authService.verifyEmailChange(auth.userId, code);
  return apiSuccess(result, 200);
}

export const POST = withErrorHandler(handler as any);
