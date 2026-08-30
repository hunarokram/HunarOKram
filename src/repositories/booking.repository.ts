import { BaseTenantRepository } from './base.repository';
import { Types } from 'mongoose';
import { Booking, IBooking } from '../models/booking.model';

export class BookingRepository extends BaseTenantRepository<IBooking> {
  constructor() {
    super(Booking);
  }

  /**
   * Concurrency-safe capacity check and booking creation/update
   */
  async bookWithCapacityCheck(organizerId: string | Types.ObjectId, scheduleId: string | Types.ObjectId, guestsCount: number, bookingData: any) {
    // Find the schedule and use findOneAndUpdate to increment booked capacity if space is available
    // This is a stub for the service layer to handle the exact concurrency using a session/transaction or atomic operations.
    throw new Error('Not implemented');
  }

  async findByBookingNumber(bookingNumber: string): Promise<IBooking | null> {
    return this.model.findOne({ bookingNumber }).lean().exec() as Promise<IBooking | null>;
  }

  async findByPaymentProviderOrderId(providerOrderId: string): Promise<IBooking | null> {
    return this.model.findOne({ paymentProviderOrderId: providerOrderId }).lean().exec() as Promise<IBooking | null>;
  }
}

export const bookingRepository = new BookingRepository();
