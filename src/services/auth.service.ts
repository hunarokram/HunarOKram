import { userRepository } from '@/repositories';
import { hashPassword, verifyPassword } from '@/lib/auth/password';
import { createSession, clearSessionCookie } from '@/lib/auth/session';
import { ConflictError, UnauthorizedError, BadRequestError } from '@/lib/errors/errors';
import { z } from 'zod';
import { loginSchema, registerSchema } from '@/schemas/auth.schema';
import { requireAuth } from '@/lib/auth/guard';
import { generateOTP, sendOTPEmail } from '@/lib/email';

export class AuthService {
  async register(data: z.infer<typeof registerSchema>) {
    const existingUser = await userRepository.findByEmail(data.email);
    if (existingUser) {
      if (existingUser.emailVerified) {
        throw new ConflictError('Email already in use');
      }
      // If not verified, we can resend OTP or just update password
    }

    const hashedPassword = await hashPassword(data.password);
    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 mins

    let user;
    if (existingUser && !existingUser.emailVerified) {
      user = await userRepository.update(existingUser._id.toString(), {
        passwordHash: hashedPassword,
        verificationCode: otp,
        verificationExpiresAt: expiresAt
      });
    } else {
      user = await userRepository.create({
        email: data.email,
        passwordHash: hashedPassword,
        globalRole: 'user',
        emailVerified: false,
        verificationCode: otp,
        verificationExpiresAt: expiresAt
      });
    }

    await sendOTPEmail(data.email, otp);

    return {
      requiresVerification: true,
      email: data.email
    };
  }

  async verifyOtp(email: string, code: string) {
    const user = await userRepository.findByEmail(email);
    if (!user) throw new BadRequestError('User not found');
    
    if (user.emailVerified) return { alreadyVerified: true };
    
    if (user.verificationCode !== code) {
      throw new BadRequestError('Invalid verification code');
    }
    if (user.verificationExpiresAt && user.verificationExpiresAt < new Date()) {
      throw new BadRequestError('Verification code expired');
    }

    await userRepository.update(user._id.toString(), {
      emailVerified: true,
      verificationCode: '',
    });

    await createSession(user._id.toString());
    
    return {
      user: { id: user._id.toString(), email: user.email, globalRole: user.globalRole },
    };
  }

  async resendOtp(email: string) {
    const user = await userRepository.findByEmail(email);
    if (!user) throw new BadRequestError('User not found');
    if (user.emailVerified) throw new BadRequestError('Email already verified');

    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    await userRepository.update(user._id.toString(), {
      verificationCode: otp,
      verificationExpiresAt: expiresAt
    });

    await sendOTPEmail(user.email, otp);
    return { success: true };
  }

  async requestEmailChange(userId: string, newEmail: string) {
    const existing = await userRepository.findByEmail(newEmail);
    if (existing && existing._id.toString() !== userId) {
      throw new ConflictError('Email already in use');
    }

    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    await userRepository.update(userId, {
      pendingEmail: newEmail,
      verificationCode: otp,
      verificationExpiresAt: expiresAt
    });

    await sendOTPEmail(newEmail, otp);
    return { success: true, message: 'OTP sent to new email' };
  }

  async verifyEmailChange(userId: string, code: string) {
    const user = await userRepository.findById(userId);
    if (!user) throw new BadRequestError('User not found');
    if (!user.pendingEmail) throw new BadRequestError('No pending email change request');
    
    if (user.verificationCode !== code) {
      throw new BadRequestError('Invalid verification code');
    }
    if (user.verificationExpiresAt && user.verificationExpiresAt < new Date()) {
      throw new BadRequestError('Verification code expired');
    }

    await userRepository.update(userId, {
      email: user.pendingEmail,
      pendingEmail: '',
      verificationCode: '',
    });

    const organizer = await organizerRepository.findOne({ ownerId: user._id });
    if (organizer) {
      await organizerRepository.update(organizer._id.toString(), {
        contact: { ...organizer.contact, email: user.pendingEmail }
      });
    }

    return { success: true, email: user.pendingEmail };
  }

  async login(data: z.infer<typeof loginSchema>) {
    const user = await userRepository.findByEmail(data.email);
    if (!user || !user.passwordHash) {
      throw new UnauthorizedError('Invalid credentials');
    }

    const isValid = await verifyPassword(data.password, user.passwordHash);
    if (!isValid) {
      throw new UnauthorizedError('Invalid credentials');
    }

    await createSession(user._id.toString());
    return {
      user: { id: user._id.toString(), email: user.email, globalRole: user.globalRole },
    };
  }

  async logout() {
    await clearSessionCookie();
  }

  async validateSession() {
    const authContext = await requireAuth();
    const user = await userRepository.findById(authContext.userId);
    if (!user) {
      throw new UnauthorizedError('User not found');
    }

    return {
      user: {
        id: user._id.toString(),
        email: user.email,
        globalRole: user.globalRole,
      }
    };
  }
}

export const authService = new AuthService();
