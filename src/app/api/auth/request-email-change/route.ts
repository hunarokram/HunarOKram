import { NextRequest } from 'next/server';
import { apiSuccess, parseBody, withErrorHandler } from '@/middleware/api-middleware';
import { authService } from '@/services/auth.service';
import { requireAuth } from '@/lib/auth/guard';
import { z } from 'zod';

const requestSchema = z.object({
  newEmail: z.string().email()
});

async function handler(req: NextRequest) {
  const auth = await requireAuth();
  const { newEmail } = await parseBody(req, requestSchema);
  const result = await authService.requestEmailChange(auth.userId, newEmail);
  return apiSuccess(result, 200);
}

export const POST = withErrorHandler(handler as any);
