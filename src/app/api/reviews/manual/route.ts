import { parseBody, apiSuccess, withErrorHandler } from '@/middleware/api-middleware';
import { requireAuth } from '@/lib/auth/guard';
import { organizerRepository } from '@/repositories/organizer.repository';
import { reviewRepository } from '@/repositories/review.repository';
import { z } from 'zod';
import { NextResponse } from 'next/server';

const createManualReviewSchema = z.object({
  rating: z.number().min(1).max(5),
  comment: z.string().optional(),
  customerName: z.string().min(1)
});

export const POST = withErrorHandler(async (request) => {
  const auth = await requireAuth();
  const data = await parseBody(request, createManualReviewSchema);
  
  const organizer = await organizerRepository.findOne({ ownerId: auth.userId as any });
  if (!organizer) {
    return NextResponse.json({ error: { message: 'Organizer not found' } }, { status: 404 });
  }

  const review = await reviewRepository.create(organizer._id as any, {
    ...data,
  });

  return apiSuccess(review, 201);
});
