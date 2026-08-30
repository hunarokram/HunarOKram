import { NextRequest } from 'next/server';
import { apiSuccess, parseBody, withErrorHandler } from '@/middleware/api-middleware';
import { authService } from '@/services/auth.service';
import { z } from 'zod';

const verifySchema = z.object({
  email: z.string().email(),
  code: z.string().length(6)
});

async function handler(req: NextRequest) {
  const { email, code } = await parseBody(req, verifySchema);
  const result = await authService.verifyOtp(email, code);
  return apiSuccess(result, 200);
}

export const POST = withErrorHandler(handler as any);
