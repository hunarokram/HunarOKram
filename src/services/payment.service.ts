import { bookingRepository } from '../repositories/booking.repository';
import { paymentRepository } from '../repositories/payment.repository';
import { razorpayClient } from '../lib/payments/razorpay';
import { NotFoundError, PaymentError, ExternalServiceError } from '../lib/errors/errors';
import mongoose from 'mongoose';

import { organizerRepository } from '../repositories/organizer.repository';
import { RazorpayClient } from '../lib/payments/razorpay';
import { notificationService } from './notification.service';
import { experienceRepository } from '../repositories/experience.repository';
import { scheduleRepository } from '../repositories/schedule.repository';
import { customerRepository } from '../repositories/customer.repository';

export class PaymentService {
  async initiatePayment(bookingNumber: string) {
    const booking = await bookingRepository.findByBookingNumber(bookingNumber);
    if (!booking) {
      throw new NotFoundError(`Booking not found: ${bookingNumber}`);
    }

    const organizer = await organizerRepository.findOne({ _id: booking.organizerId });
    if (!organizer || !organizer.paymentSettings?.razorpayKeyId || !organizer.paymentSettings?.razorpayKeySecret) {
      throw new ExternalServiceError('Organizer has not configured payments.');
    }

    const client = new RazorpayClient(
      organizer.paymentSettings.razorpayKeyId,
      organizer.paymentSettings.razorpayKeySecret
    );

    try {
      // Amount is already in paise
      const order = await client.createOrder(booking.amount, bookingNumber);
      
      // Update booking with the razorpay order ID
      await bookingRepository.update(
        booking.organizerId, 
        booking._id, 
        { paymentProviderOrderId: order.id }
      );

      return {
        orderId: order.id,
        amount: booking.amount,
        currency: 'INR',
        keyId: organizer.paymentSettings.razorpayKeyId
      };
    } catch (error: any) {
      throw new ExternalServiceError(`Failed to initiate payment: ${error.message}`);
    }
  }

  async handleWebhook(body: string, signature: string) {
    const payload = JSON.parse(body);
    
    // We only care about payment.captured for now
    if (payload.event === 'payment.captured') {
      const orderId = payload.payload.payment.entity.order_id;
      
      // 1. Find booking
      const booking = await bookingRepository.findByPaymentProviderOrderId(orderId);
      if (!booking) {
        throw new NotFoundError(`Booking not found for order: ${orderId}`);
      }

      // 2. Find Organizer to get webhook secret
      const organizer = await organizerRepository.findOne({ _id: booking.organizerId });
      const secret = organizer?.paymentSettings?.razorpayWebhookSecret;

      if (!secret) {
        throw new PaymentError('Organizer has no webhook secret configured');
      }

      // 3. Verify signature using a dummy client or static method
      const dummyClient = new RazorpayClient('dummy', 'dummy');
      if (!dummyClient.verifyWebhookSignature(body, signature, secret)) {
        throw new PaymentError('Invalid webhook signature');
      }
      const amount = payload.payload.payment.entity.amount;

      // Create a payment record
      // PaymentRepository extends BaseTenantRepository, so create takes organizerId
      await paymentRepository.create(booking.organizerId, {
        providerOrderId: orderId,
        bookingId: new mongoose.Types.ObjectId(booking._id),
        amount: amount
      });

      // Update booking status to confirmed
      const updatedBooking = await bookingRepository.update(
        booking.organizerId,
        booking._id,
        { status: 'confirmed' as any } 
      );

      // Trigger Email Notifications
      try {
        const experience = await experienceRepository.findById(booking.organizerId, booking.experienceId.toString());
        const schedule = await scheduleRepository.findById(booking.organizerId, booking.scheduleId.toString());
        const customer = await customerRepository.findById(booking.organizerId, booking.customerId.toString());
        
        if (experience && schedule && customer) {
          await notificationService.sendBookingConfirmation(updatedBooking, experience, schedule, customer);
          await notificationService.sendOrganizerAlert(updatedBooking, experience, schedule, organizer, customer);
        }
      } catch (e) {
        console.error('Failed to send email notifications:', e);
      }
    }
    
    return { success: true };
  }
}

export const paymentService = new PaymentService();
