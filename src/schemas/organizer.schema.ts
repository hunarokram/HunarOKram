import { z } from 'zod';
import { slugSchema, emailSchema, safeStringSchema } from '@/schemas/common.schema';

export const createOrganizerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100).transform(v => v.trim()),
  slug: slugSchema,
  bio: z.string().max(500).optional(),
  avatar: z.string().url().optional().or(z.literal('')),
  coverImage: z.string().url().optional().or(z.literal('')),
  mobileCoverImage: z.string().url().optional().or(z.literal('')),
  pastCustomersCount: z.number().min(0).optional(),
  contact: z.object({
    email: emailSchema,
  }).optional(),
  paymentSettings: z.object({
    razorpayKeyId: safeStringSchema(100).optional(),
    razorpayKeySecret: safeStringSchema(100).optional(),
    razorpayWebhookSecret: safeStringSchema(100).optional(),
    acceptedMethods: z.enum(['razorpay', 'manual', 'both']).optional(),
    manualPaymentUpiId: safeStringSchema(100).optional(),
    manualPaymentQrCodeUrl: z.string().url().optional().or(z.literal('')),
    manualPaymentLink: z.string().url().optional().or(z.literal('')),
  }).optional(),
  theme: z.enum(['terracotta', 'ocean', 'forest', 'midnight', 'sunset', 'lavender', 'monochrome']).optional(),
});

export const updateOrganizerSchema = createOrganizerSchema.partial().extend({
  customDomain: z.string().optional(),
});
