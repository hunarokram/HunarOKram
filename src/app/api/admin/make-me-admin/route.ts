import { requireAuth } from '@/lib/auth/guard';
import { apiSuccess, withErrorHandler } from '@/middleware/api-middleware';
import { userRepository } from '@/repositories/index';

export const POST = withErrorHandler(async (request) => {
  const auth = await requireAuth();
  
  const body = await request.json();
  const secret = body?.secret;

  if (!secret || secret !== process.env.ADMIN_SECRET_KEY) {
    throw new Error('Invalid Admin Secret Key');
  }

  const updatedUser = await userRepository.update(auth.userId, {
    $set: { globalRole: 'admin' }
  });

  return apiSuccess({ message: 'You are now an admin. Please refresh the page.' }, 200);
});
