import { requireAuth } from '@/lib/auth/guard';
import { apiSuccess, withErrorHandler } from '@/middleware/api-middleware';
import { organizerRepository, experienceRepository, bookingRepository } from '@/repositories/index';
import { ForbiddenError } from '@/lib/errors/errors';

export const GET = withErrorHandler(async (request) => {
  const auth = await requireAuth();
  if (auth.globalRole !== 'admin') {
    throw new ForbiddenError('Only super admins can access this route');
  }

  // Use raw mongoose models to do efficient counts and aggregations
  const OrganizerModel = (organizerRepository as any).model;
  const ExperienceModel = (experienceRepository as any).model;
  const BookingModel = (bookingRepository as any).model;

  // Run all queries in parallel for speed
  const [totalOrganizers, totalExperiences, totalBookings, revenueData] = await Promise.all([
    OrganizerModel.countDocuments(),
    ExperienceModel.countDocuments(),
    BookingModel.countDocuments(),
    BookingModel.aggregate([
      { $match: { status: 'confirmed' } },
      { $group: { _id: null, totalRevenue: { $sum: '$amount' } } }
    ])
  ]);

  const totalRevenue = revenueData.length > 0 ? revenueData[0].totalRevenue : 0;

  return apiSuccess({
    organizers: totalOrganizers,
    experiences: totalExperiences,
    bookings: totalBookings,
    gmv: totalRevenue
  }, 200);
});
