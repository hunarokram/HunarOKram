import { z } from 'zod';
import { emailSchema, passwordSchema, safeStringSchema } from './common.schema';

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
});

export const registerSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  name: safeStringSchema(100).optional(),
});
