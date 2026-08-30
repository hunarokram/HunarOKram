import { requireAuth } from '@/lib/auth/guard';
import { apiSuccess, withErrorHandler } from '@/middleware/api-middleware';
import { organizerRepository, experienceRepository, bookingRepository } from '@/repositories/index';
import { ForbiddenError } from '@/lib/errors/errors';

export const GET = withErrorHandler(async (request) => {
  const auth = await requireAuth();
  if (auth.globalRole !== 'admin') {
    throw new ForbiddenError('Only super admins can access this route');
  }

  // Fetch all organizers
  const organizers = await organizerRepository.findMany({});
  
  // Attach experience count and total revenue for each
  const BookingModel = (bookingRepository as any).model;
  
  const enrichOrganizers = await Promise.all(organizers.map(async (org) => {
    const experiences = await experienceRepository.findMany(org._id, {});
    
    // Calculate GMV for this organizer
    const revenueData = await BookingModel.aggregate([
      { $match: { organizerId: org._id, status: 'confirmed' } },
      { $group: { _id: null, totalRevenue: { $sum: '$amount' } } }
    ]);
    const totalRevenue = revenueData.length > 0 ? revenueData[0].totalRevenue : 0;

    return {
      ...org,
      experiencesCount: experiences.length,
      totalRevenue
    };
  }));

  // Sort by newest first
  enrichOrganizers.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return apiSuccess(enrichOrganizers, 200);
});

export const PATCH = withErrorHandler(async (request) => {
  const auth = await requireAuth();
  if (auth.globalRole !== 'admin') {
    throw new ForbiddenError('Only super admins can access this route');
  }

  const { organizerId, subscriptionStatus } = await request.json();
  if (!organizerId || !subscriptionStatus) {
    throw new Error('organizerId and subscriptionStatus are required');
  }

  const updateData: any = { subscriptionStatus };

  if (subscriptionStatus === 'active') {
    const expiresAt = new Date();
    expiresAt.setMonth(expiresAt.getMonth() + 1);
    updateData.subscriptionExpiresAt = expiresAt;
  } else if (subscriptionStatus === 'free') {
    updateData.subscriptionExpiresAt = null;
  }

  const updatedOrganizer = await organizerRepository.update(organizerId, {
    $set: updateData
  });

  return apiSuccess(updatedOrganizer, 200);
});
