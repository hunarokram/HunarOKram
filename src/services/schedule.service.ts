import { Types } from 'mongoose';
import { scheduleRepository } from '@/repositories/schedule.repository';
import { experienceRepository } from '@/repositories/experience.repository';
import { organizerRepository } from '@/repositories/organizer.repository';
import { NotFoundError, ConflictError, ForbiddenError } from '@/lib/errors/errors';
import { CreateScheduleInput, UpdateScheduleInput, ScheduleQueryInput } from '@/schemas/schedule.schema';
import { bookingRepository } from '@/repositories/booking.repository';
import { customerRepository } from '@/repositories/customer.repository';
import { notificationService } from '@/services/notification.service';

export class ScheduleService {
  async createSchedule(organizerId: string, data: CreateScheduleInput) {
    const experience = await experienceRepository.findById(organizerId, data.experienceId);
    if (!experience) {
      throw new NotFoundError('Experience not found');
    }

    // Subscription check
    const organizer = await organizerRepository.findById(organizerId);
    if (!organizer) {
      throw new NotFoundError('Organizer not found');
    }

    let isExpired = false;
    if (organizer.subscriptionExpiresAt && new Date() > new Date(organizer.subscriptionExpiresAt)) {
      isExpired = true;
    }

    if (organizer.subscriptionStatus === 'active' && !isExpired) {
      // Unlimited access
    } else if (isExpired) {
      throw new ForbiddenError('Your subscription has expired. Please renew your plan to create new schedules.');
    } else {
      // Free lifetime limit
      const existingSchedules = await scheduleRepository.findMany(organizerId, { experienceId: new Types.ObjectId(data.experienceId) });
      if (existingSchedules.length >= 1) {
        throw new ForbiddenError('You can only create 1 schedule per workshop on the free tier. Please upgrade to create more.');
      }
    }

    // overlapping check? Not required by prompt but usually good. I'll stick to requested logic.
    return scheduleRepository.create(organizerId, {
      ...data,
      experienceId: new Types.ObjectId(data.experienceId) as any,
    });
  }

  async getSchedules(organizerId: string, query: ScheduleQueryInput) {
    const filter: any = {};
    if (query.experienceId) {
      filter.experienceId = new Types.ObjectId(query.experienceId);
    }
    
    if (query.fromDate || query.toDate) {
      filter.startAt = {};
      if (query.fromDate) filter.startAt.$gte = query.fromDate;
      if (query.toDate) filter.startAt.$lte = query.toDate;
    }

    return scheduleRepository.findMany(organizerId, filter);
  }

  async updateSchedule(organizerId: string, scheduleId: string, data: UpdateScheduleInput) {
    const schedule = await scheduleRepository.findById(organizerId, scheduleId);
    if (!schedule) {
      throw new NotFoundError('Schedule not found');
    }

    if (data.capacity !== undefined && data.capacity < schedule.bookedCount) {
      throw new ConflictError('Cannot reduce capacity below the number of existing bookings');
    }

    // Prevent changing dates if the schedule has already passed
    if (new Date(schedule.endAt) < new Date()) {
      if (data.startAt || data.endAt) {
        throw new ConflictError('Cannot change the date of a schedule that has already ended');
      }
    }

    // If startAt and endAt are updated, ensure we don't violate the constraint if only one is updated
    const newStart = data.startAt || schedule.startAt;
    const newEnd = data.endAt || schedule.endAt;
    if (newStart >= newEnd) {
      throw new ConflictError('startAt must be before endAt');
    }

    const updated = await scheduleRepository.update(organizerId, scheduleId, data);

    // If dates were changed and there are existing bookings, send reschedule emails
    const dateChanged = (data.startAt && data.startAt !== schedule.startAt) || (data.endAt && data.endAt !== schedule.endAt);
    if (updated && dateChanged && schedule.bookedCount > 0) {
      // Defer to background to not block the request
      (async () => {
        try {
          const experience = await experienceRepository.findById(organizerId, schedule.experienceId as any);
          const { bookingRepository } = await import('@/repositories/booking.repository');
          const { notificationService } = await import('@/services/notification.service');
          
          // Get all confirmed bookings for this schedule, populating the customer
          const bookings = await (bookingRepository as any).model
            .find({ scheduleId, status: 'confirmed' })
            .populate('customerId')
            .lean();

          for (const booking of bookings) {
            if (booking.customerId?.email) {
              await notificationService.sendRescheduleAlert(
                booking,
                experience,
                schedule, // old schedule
                updated,  // new schedule
                booking.customerId
              );
            }
          }
        } catch (err) {
          console.error('Failed to send reschedule emails:', err);
        }
      })();
    }

    return updated;
  }

  async deleteSchedule(organizerId: string, scheduleId: string) {
    const schedule = await scheduleRepository.findById(organizerId, scheduleId);
    if (!schedule) {
      throw new NotFoundError('Schedule not found');
    }

    const experience = await experienceRepository.findById(organizerId, schedule.experienceId);

    if (schedule.bookedCount > 0) {
      // Find all bookings for this schedule
      const bookings = await bookingRepository.findMany(organizerId, {
        scheduleId: schedule._id,
        status: { $in: ['confirmed', 'pending', 'pending_payment'] }
      });

      // Mark all as cancelled
      for (const booking of bookings) {
        await bookingRepository.update(organizerId, booking._id, { status: 'cancelled' });
        
        // Send email
        try {
          const customer = await customerRepository.findById(organizerId, booking.customerId as any);
          if (customer && experience) {
            await notificationService.sendCancellationAlert(booking, experience, schedule, { name: customer.name || 'Customer', email: customer.email });
          }
        } catch (e) {
          console.error(`Failed to send cancellation email for booking ${booking._id}`, e);
        }
      }
    }

    await scheduleRepository.delete(organizerId, scheduleId);
    return { success: true };
  }
}

export const scheduleService = new ScheduleService();
