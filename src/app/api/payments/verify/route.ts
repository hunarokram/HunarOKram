import { NextResponse } from 'next/server';
import { bookingRepository } from '@/repositories/booking.repository';
import { paymentRepository } from '@/repositories/payment.repository';
import { organizerRepository } from '@/repositories/organizer.repository';
import { experienceRepository } from '@/repositories/experience.repository';
import { scheduleRepository } from '@/repositories/schedule.repository';
import { customerRepository } from '@/repositories/customer.repository';
import { notificationService } from '@/services/notification.service';
import { RazorpayClient } from '@/lib/payments/razorpay';
import mongoose from 'mongoose';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature, bookingNumber } = body;

    const booking = await bookingRepository.findByBookingNumber(bookingNumber);
    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    const organizer = await organizerRepository.findOne({ _id: booking.organizerId });
    if (!organizer || !organizer.paymentSettings?.razorpayKeySecret) {
      return NextResponse.json({ error: 'Organizer payments not configured' }, { status: 400 });
    }

    const client = new RazorpayClient();
    const isValid = client.verifySignature(
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature, 
      organizer.paymentSettings.razorpayKeySecret
    );

    if (!isValid) {
      return NextResponse.json({ error: 'Invalid payment signature' }, { status: 400 });
    }

    // Update booking status
    const updatedBooking = await bookingRepository.update(
      booking.organizerId,
      booking._id,
      { status: 'confirmed' as any, paymentProviderOrderId: razorpay_order_id }
    );

    // Record payment
    await paymentRepository.create(booking.organizerId, {
      providerOrderId: razorpay_order_id,
      bookingId: new mongoose.Types.ObjectId(booking._id),
      amount: booking.amount
    });

    // Send emails
    if (updatedBooking) {
      try {
        const experience = await experienceRepository.findById(booking.organizerId, booking.experienceId.toString());
        const schedule = await scheduleRepository.findById(booking.organizerId, booking.scheduleId.toString());
        const customer = await customerRepository.findById(booking.organizerId, booking.customerId.toString());
        if (experience && schedule && customer) {
          await notificationService.sendBookingConfirmation(updatedBooking, experience, schedule, customer);
          await notificationService.sendOrganizerAlert(updatedBooking, experience, schedule, organizer, customer);
        }
      } catch (e) {
        console.error('Failed to send emails on verification', e);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Verification error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
