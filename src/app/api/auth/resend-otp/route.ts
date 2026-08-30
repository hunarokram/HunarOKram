import { NextRequest } from 'next/server';
import { apiSuccess, parseBody, withErrorHandler } from '@/middleware/api-middleware';
import { authService } from '@/services/auth.service';
import { z } from 'zod';

const resendSchema = z.object({
  email: z.string().email()
});

async function handler(req: NextRequest) {
  const { email } = await parseBody(req, resendSchema);
  const result = await authService.resendOtp(email);
  return apiSuccess(result, 200);
}

export const POST = withErrorHandler(handler as any);
