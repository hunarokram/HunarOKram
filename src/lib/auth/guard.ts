import { getSessionToken } from './session';
import { sessionRepository, userRepository } from '@/repositories';
import { UnauthorizedError } from '@/lib/errors/errors';
import { GlobalRole } from '@/types';

export interface AuthContext {
  userId: string;
  globalRole: GlobalRole;
}

export async function requireAuth(): Promise<AuthContext> {
  const token = await getSessionToken();
  if (!token) {
    throw new UnauthorizedError('No session token provided');
  }

  const session = await sessionRepository.findOne({ token });
  if (!session) {
    throw new UnauthorizedError('Invalid session token');
  }

  if (new Date() > new Date(session.expiresAt)) {
    await sessionRepository.deleteByToken(token);
    throw new UnauthorizedError('Session expired');
  }

  const user = await userRepository.findById(session.userId.toString());
  if (!user) {
    throw new UnauthorizedError('User not found');
  }

  return {
    userId: user._id.toString(),
    globalRole: user.globalRole,
  };
}
