import { z } from 'zod';

export const createBookingSchema = z.object({
  organizerId: z.string().min(1, 'Organizer ID is required'),
  experienceId: z.string().min(1, 'Experience ID is required'),
  scheduleId: z.string().min(1, 'Schedule ID is required'),
  quantity: z.number().int().min(1).default(1),
  idempotencyKey: z.string().uuid('Invalid idempotency key'),
  customerDetails: z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email address'),
    phone: z.string().min(1, 'Phone number is required'),
  }),
  paymentMethod: z.enum(['razorpay', 'manual']).optional().default('razorpay'),
  paymentScreenshotUrl: z.string().url().optional().or(z.literal('')),
});

export type CreateBookingInput = z.infer<typeof createBookingSchema>;
