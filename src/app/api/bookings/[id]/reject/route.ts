import { requireAuth } from '@/lib/auth/guard';
import { organizerRepository } from '@/repositories/organizer.repository';
import { bookingRepository } from '@/repositories/booking.repository';
import { experienceRepository } from '@/repositories/experience.repository';
import { scheduleRepository } from '@/repositories/schedule.repository';
import { customerRepository } from '@/repositories/customer.repository';
import { notificationService } from '@/services/notification.service';
import { apiSuccess, withErrorHandler } from '@/middleware/api-middleware';
import { NextResponse } from 'next/server';

export const POST = withErrorHandler(async (request, { params }) => {
  const auth = await requireAuth();
  const { id } = await params;
  
  const organizer = await organizerRepository.findOne({ ownerId: auth.userId as any });
  
  if (!organizer) {
    return NextResponse.json({ error: { code: 'NOT_FOUND', message: 'Organizer not found' } }, { status: 404 });
  }

  const BookingModel = (bookingRepository as any).model;
  
  const booking = await BookingModel.findOne({
    _id: id,
    organizerId: organizer._id
  });

  if (!booking) {
    return NextResponse.json({ error: { code: 'NOT_FOUND', message: 'Booking not found' } }, { status: 404 });
  }

  if (booking.status === 'confirmed') {
    return NextResponse.json({ error: { code: 'BAD_REQUEST', message: 'Booking is already confirmed' } }, { status: 400 });
  }
  
  if (booking.status === 'rejected') {
    return NextResponse.json({ error: { code: 'BAD_REQUEST', message: 'Booking is already rejected' } }, { status: 400 });
  }

  // Restore the reserved spots
  if (booking.status === 'pending') {
    await scheduleRepository.releaseSpot(organizer._id as any, booking.scheduleId.toString(), booking.quantity);
  }

  booking.status = 'rejected';
  await booking.save();

  try {
    const experience = await experienceRepository.findById(organizer._id as any, booking.experienceId.toString());
    const schedule = await scheduleRepository.findById(organizer._id as any, booking.scheduleId.toString());
    const customer = await customerRepository.findById(organizer._id as any, booking.customerId.toString());
    
    if (experience && schedule && customer) {
      await notificationService.sendBookingRejection(booking, experience, schedule, customer);
    }
  } catch (err) {
    console.error('Failed to send rejection email:', err);
  }

  return apiSuccess({ message: 'Booking rejected successfully', booking });
});
