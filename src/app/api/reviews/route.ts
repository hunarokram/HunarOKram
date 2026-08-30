import { parseBody, apiSuccess, withErrorHandler } from '@/middleware/api-middleware';
import { requireAuth } from '@/lib/auth/guard';
import { organizerRepository } from '@/repositories/organizer.repository';
import { reviewRepository } from '@/repositories/review.repository';
import { experienceRepository } from '@/repositories/experience.repository';
import { Experience } from '@/models/experience.model';
import { createReviewSchema } from '@/schemas/review.schema';
import { NextResponse } from 'next/server';
import { Types } from 'mongoose';

export const GET = withErrorHandler(async (request) => {
  const { searchParams } = new URL(request.url);
  const experienceId = searchParams.get('experienceId');
  const forOrganizer = searchParams.get('forOrganizer');

  if (experienceId) {
    // @ts-ignore
    const experience = await Experience.findOne({ _id: experienceId });
    if (!experience) return NextResponse.json({ error: { message: 'Not found' } }, { status: 404 });
    const reviews = await reviewRepository.findMany(experience.organizerId as any, { experienceId: new Types.ObjectId(experienceId) as any });
    return apiSuccess(reviews);
  }

  if (forOrganizer === 'true') {
    const auth = await requireAuth();
    const organizer = await organizerRepository.findOne({ ownerId: auth.userId as any });
    if (!organizer) return NextResponse.json({ error: { message: 'Not found' } }, { status: 404 });
    const reviews = await reviewRepository.findMany(organizer._id as any, {});
    return apiSuccess(reviews);
  }

  return NextResponse.json({ error: { message: 'Invalid query' } }, { status: 400 });
});

export const POST = withErrorHandler(async (request) => {
  const data = await parseBody(request, createReviewSchema);
  
  // @ts-ignore
  const experience = await Experience.findOne({ _id: data.experienceId });
  if (!experience) {
    return NextResponse.json({ error: { message: 'Experience not found' } }, { status: 404 });
  }

  const review = await reviewRepository.create(experience.organizerId as any, {
    ...data,
    experienceId: experience._id,
  });

  return apiSuccess(review, 201);
});
