import { NextResponse } from 'next/server';
import { paymentService } from '@/services/payment.service';
import { createErrorResponse } from '@/lib/errors/error-handler';
import { ValidationError } from '@/lib/errors/errors';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { bookingNumber } = body;

    if (!bookingNumber) {
      throw new ValidationError('bookingNumber is required');
    }

    const result = await paymentService.initiatePayment(bookingNumber);
    return NextResponse.json(result);
  } catch (error) {
    const errorResponse = createErrorResponse(error);
    return NextResponse.json(errorResponse.body, { status: errorResponse.status });
  }
}
