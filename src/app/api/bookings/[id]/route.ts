import { NextRequest } from 'next/server';
import { apiSuccess, withErrorHandler } from '@/middleware/api-middleware';
import { bookingService } from '@/services/booking.service';
import { ValidationError } from '@/lib/errors/errors';

export const GET = withErrorHandler(async (request, context) => {
  const url = new URL(request.url);
  const organizerId = url.searchParams.get('organizerId');
  
  if (!organizerId) {
    throw new ValidationError('organizerId is required in query parameters');
  }

  const params = await context.params;
  const bookingNumber = params.id as string;

  const booking = await bookingService.getBooking(organizerId, bookingNumber);
  
  return apiSuccess(booking, 200);
});
