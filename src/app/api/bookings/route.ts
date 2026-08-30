import { parseBody, apiSuccess, withErrorHandler } from '@/middleware/api-middleware';
import { createBookingSchema } from '@/schemas/booking.schema';
import { bookingService } from '@/services/booking.service';

export const POST = withErrorHandler(async (request) => {
  const data = await parseBody(request, createBookingSchema);
  
  const booking = await bookingService.createBooking(data);
  
  return apiSuccess(booking, 201);
});

import { requireAuth } from '@/lib/auth/guard';
import { organizerRepository } from '@/repositories/organizer.repository';
import { bookingRepository } from '@/repositories/booking.repository';
import { NextResponse } from 'next/server';

export const GET = withErrorHandler(async (request) => {
  const auth = await requireAuth();
  const organizer = await organizerRepository.findOne({ ownerId: auth.userId as any });
  
  if (!organizer) {
    return NextResponse.json({ error: { code: 'NOT_FOUND', message: 'Organizer not found' } }, { status: 404 });
  }

  const { searchParams } = new URL(request.url);
  const scheduleId = searchParams.get('scheduleId');

  const query: any = {};
  if (scheduleId) {
    query.scheduleId = scheduleId;
  }

  // Fetch bookings, populate customer info, and sort newest first
  const bookings = await (bookingRepository as any).model
    .find({ ...query, organizerId: organizer._id })
    .populate('customerId')
    .sort({ createdAt: -1 })
    .lean();
    
  return apiSuccess(bookings);
});
