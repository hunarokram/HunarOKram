import { BaseTenantRepository } from './base.repository';
import { Types } from 'mongoose';
import { Schedule, ISchedule } from '../models/schedule.model';
import { ConflictError } from '../lib/errors/errors';

export class ScheduleRepository extends BaseTenantRepository<ISchedule> {
  constructor() {
    super(Schedule);
  }

  async findAvailableSlots(organizerId: string | Types.ObjectId, experienceId: string | Types.ObjectId, startDate: Date, endDate: Date) {
    return this.findMany(organizerId, {
      experienceId,
      startAt: { $gte: startDate, $lte: endDate }
    });
  }

  async reserveSpot(organizerId: string | Types.ObjectId, scheduleId: string | Types.ObjectId, quantity: number) {
    const updated = await this.model.findOneAndUpdate(
      {
        _id: scheduleId,
        organizerId,
        $expr: {
          $gte: ['$capacity', { $add: ['$bookedCount', quantity] }]
        }
      },
      {
        $inc: { bookedCount: quantity }
      },
      { returnDocument: 'after' }
    );
    if (!updated) {
      throw new ConflictError('Schedule is fully booked');
    }
    return updated;
  }

  async releaseSpot(organizerId: string | Types.ObjectId, scheduleId: string | Types.ObjectId, quantity: number) {
    return this.model.findOneAndUpdate(
      {
        _id: scheduleId,
        organizerId,
      },
      {
        $inc: { bookedCount: -quantity }
      },
      { returnDocument: 'after' }
    );
  }
}

export const scheduleRepository = new ScheduleRepository();
