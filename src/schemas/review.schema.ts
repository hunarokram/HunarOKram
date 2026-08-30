import { z } from 'zod';

export const createReviewSchema = z.object({
  experienceId: z.string(),
  rating: z.number().min(1).max(5),
  comment: z.string().optional(),
  customerName: z.string().min(1)
});

export type CreateReviewInput = z.infer<typeof createReviewSchema>;
