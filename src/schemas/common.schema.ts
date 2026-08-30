import { z } from 'zod';

// ============================================================
// Common Zod Schemas — Shared across features
// ============================================================

/** MongoDB ObjectId string validation */
export const objectIdSchema = z
  .string()
  .regex(/^[a-fA-F0-9]{24}$/, 'Invalid ID format');

/** Email validation */
export const emailSchema = z
  .string()
  .email('Please enter a valid email address')
  .max(255, 'Email is too long')
  .transform((v) => v.toLowerCase().trim());

/** Phone validation (Indian format) */
export const phoneSchema = z
  .string()
  .regex(/^\+?91?\d{10}$/, 'Please enter a valid 10-digit phone number')
  .transform((v) => v.replace(/\s+/g, ''));

/** Password validation */
export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(128, 'Password is too long')
  .regex(/[a-z]/, 'Password must contain a lowercase letter')
  .regex(/[A-Z]/, 'Password must contain an uppercase letter')
  .regex(/[0-9]/, 'Password must contain a number');

/** Slug validation */
export const slugSchema = z
  .string()
  .min(3, 'Slug must be at least 3 characters')
  .max(60, 'Slug is too long')
  .regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    'Slug must contain only lowercase letters, numbers, and hyphens'
  );

/** URL validation */
export const urlSchema = z
  .string()
  .url('Please enter a valid URL')
  .max(2048, 'URL is too long');

/** Positive integer (for amounts in paise) */
export const positiveIntSchema = z
  .number()
  .int('Must be a whole number')
  .nonnegative('Must be zero or positive');

/** Safe pagination params */
export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
});

/** Sort params */
export const sortSchema = z.object({
  sortBy: z.string().optional(),
  sortDir: z.enum(['asc', 'desc']).default('desc'),
});

/** Date range filter */
export const dateRangeSchema = z.object({
  from: z.coerce.date().optional(),
  to: z.coerce.date().optional(),
});

/** Search query */
export const searchSchema = z.object({
  q: z.string().max(200).optional(),
});

/** Safe string — trimmed, no HTML */
export const safeStringSchema = (maxLength = 1000) =>
  z
    .string()
    .max(maxLength, `Text is too long (max ${maxLength} characters)`)
    .transform((v) => v.trim().replace(/<[^>]*>/g, ''));

/** Price in paise */
export const priceSchema = z
  .number()
  .int('Price must be in whole paise')
  .min(0, 'Price cannot be negative')
  .max(10_000_000, 'Price exceeds maximum'); // ₹1,00,000 max
