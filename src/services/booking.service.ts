import { Types } from 'mongoose';
import { CreateBookingInput } from '../schemas/booking.schema';
import { bookingRepository } from '../repositories/booking.repository';
import { customerRepository } from '../repositories/customer.repository';
import { experienceRepository } from '../repositories/experience.repository';
import { scheduleRepository } from '../repositories/schedule.repository';
import { organizerRepository } from '../repositories/organizer.repository';
import { notificationService } from './notification.service';
import { generateBookingNumber } from '../utils/string';
import { ConflictError, NotFoundError } from '../lib/errors/errors';

export class BookingService {
  async createBooking(data: CreateBookingInput) {
    const { organizerId, experienceId, scheduleId, quantity, idempotencyKey, customerDetails } = data;

    const existingBooking = await bookingRepository.findOne(organizerId, { idempotencyKey });
    if (existingBooking) {
      return existingBooking;
    }

    let customer = await customerRepository.findOne(organizerId, { email: customerDetails.email });
    if (!customer) {
      customer = await customerRepository.create(organizerId, {
        name: customerDetails.name,
        email: customerDetails.email,
        phone: customerDetails.phone,
      });
    }

    const experience = await experienceRepository.findById(organizerId, experienceId);
    if (!experience) {
      throw new NotFoundError('Experience not found');
    }

    await scheduleRepository.reserveSpot(organizerId, scheduleId, quantity);

    let discountPercentage = 0;
    if (experience.offers && experience.offers.length > 0) {
      for (const offer of experience.offers) {
        if (quantity >= offer.minQuantity && offer.discountPercentage > discountPercentage) {
          discountPercentage = offer.discountPercentage;
        }
      }
    }

    const baseAmount = experience.price * quantity;
    const amount = Math.round(baseAmount * (1 - discountPercentage / 100));
    const bookingNumber = generateBookingNumber();

    const booking = await bookingRepository.create(organizerId, {
      bookingNumber,
      experienceId: new Types.ObjectId(experienceId),
      scheduleId: new Types.ObjectId(scheduleId),
      customerId: customer._id,
      amount,
      status: 'pending', // Both razorpay and manual start as pending until verified/paid
      paymentMethod: data.paymentMethod || 'razorpay',
      paymentScreenshotUrl: data.paymentScreenshotUrl,
      idempotencyKey,
      quantity, // Passing it just in case the model is updated later
    } as any);

    // Send immediate alert for manual bookings so the organizer knows to verify them
    if (data.paymentMethod === 'manual') {
      try {
        const organizer = await organizerRepository.findById(organizerId);
        const schedule = await scheduleRepository.findById(organizerId, scheduleId);
        if (organizer && schedule) {
          await notificationService.sendOrganizerAlert(booking, experience, schedule, organizer, customer);
        }
      } catch (e) {
        console.error('Failed to send manual booking alert:', e);
      }
    }

    return booking;
  }

  async getBooking(organizerId: string, bookingNumber: string) {
    const booking = await bookingRepository.findOne(organizerId, { bookingNumber });
    if (!booking) {
      throw new NotFoundError('Booking not found');
    }
    return booking;
  }
}

export const bookingService = new BookingService();
