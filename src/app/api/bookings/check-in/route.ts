import { requireAuth } from '@/lib/auth/guard';
import { organizerRepository } from '@/repositories/organizer.repository';
import { bookingRepository } from '@/repositories/booking.repository';
import { NextResponse } from 'next/server';
import { withErrorHandler, parseBody, apiSuccess } from '@/middleware/api-middleware';
import { z } from 'zod';

const checkInSchema = z.object({
  bookingNumber: z.string().min(1),
  checkInCount: z.number().int().min(1).default(1),
});

export const POST = withErrorHandler(async (request) => {
  const auth = await requireAuth();
  const organizer = await organizerRepository.findOne({ ownerId: auth.userId as any });
  
  if (!organizer) {
    return NextResponse.json({ error: { code: 'NOT_FOUND', message: 'Organizer not found' } }, { status: 404 });
  }

  const { bookingNumber, checkInCount } = await parseBody(request, checkInSchema);

  const booking = await bookingRepository.findOne(organizer._id, { bookingNumber });
  if (!booking) {
    return NextResponse.json({ error: { code: 'NOT_FOUND', message: 'Booking not found' } }, { status: 404 });
  }

  if (booking.status !== 'confirmed') {
    return NextResponse.json({ error: { code: 'BAD_REQUEST', message: 'Booking is not confirmed' } }, { status: 400 });
  }

  const newCount = (booking.checkedInCount || 0) + checkInCount;
  if (newCount > booking.quantity) {
    return NextResponse.json({ error: { code: 'BAD_REQUEST', message: 'Cannot check in more attendees than tickets booked' } }, { status: 400 });
  }

  const updatedBooking = await bookingRepository.update(organizer._id, booking._id as any, { checkedInCount: newCount });

  return apiSuccess(updatedBooking);
});
