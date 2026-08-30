import { requireAuth } from '@/lib/auth/guard';
import { apiError, apiSuccess, withErrorHandler } from '@/middleware/api-middleware';
import { scheduleRepository } from '@/repositories/schedule.repository';
import { experienceRepository } from '@/repositories/experience.repository';
import { organizerRepository } from '@/repositories/index';
import { ForbiddenError, NotFoundError } from '@/lib/errors/errors';
import { notificationService } from '@/services/notification.service';
import { bookingRepository, customerRepository } from '@/repositories/index';
import { connectToDatabase } from '@/lib/db/connection';
import { Types } from 'mongoose';

async function getOrganizerId(userId: string) {
  const organizer = await organizerRepository.findOne({ ownerId: userId });
  if (!organizer) {
    throw new ForbiddenError('You must complete organizer onboarding first');
  }
  return organizer._id.toString();
}

export const PATCH = withErrorHandler(async (request, context) => {
  const auth = await requireAuth();
  const organizerId = await getOrganizerId(auth.userId);
  const params = await context.params;

  const body = await request.json();
  const { sessions, capacity } = body;

  if (!sessions || !sessions.length) {
    return apiError('VALIDATION_ERROR', 'At least one session is required', 400);
  }

  await connectToDatabase();

  // Validate the schedule exists and belongs to this organizer
  const oldSchedule = await scheduleRepository.findById(organizerId as string, params.id as string);
  if (!oldSchedule) {
    throw new NotFoundError('Schedule not found');
  }

  // Sort sessions
  const sortedSessions = [...sessions].sort((a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime());
  const startAt = new Date(sortedSessions[0].startAt);
  const endAt = new Date(sortedSessions[sortedSessions.length - 1].endAt);

  // Use the repository to update
  const newSchedule = await scheduleRepository.update(organizerId as string, params.id as string, {
    sessions: sortedSessions,
    startAt,
    endAt,
    capacity: capacity || oldSchedule.capacity
  });
  if (!newSchedule) {
    throw new NotFoundError('Schedule not found');
  }

  // Fetch experience details for the email
  const experience = await experienceRepository.findById(organizerId, oldSchedule.experienceId);

  // Notify booked customers
  if (experience && oldSchedule.bookedCount > 0) {
    const bookings = await bookingRepository.findMany(organizerId as string, { 
      scheduleId: oldSchedule._id,
      status: { $in: ['confirmed', 'pending'] }
    });

    for (const booking of bookings) {
      try {
        const customer = await customerRepository.findById(organizerId as string, booking.customerId as any);
        if (customer) {
          await notificationService.sendRescheduleAlert(
            booking,
            experience,
            oldSchedule,
            newSchedule,
            { name: customer.name, email: customer.email }
          );
        }
      } catch (emailErr) {
        console.error(`Failed to send reschedule email for booking ${booking._id}`, emailErr);
      }
    }
  }

  return apiSuccess(newSchedule);
});
