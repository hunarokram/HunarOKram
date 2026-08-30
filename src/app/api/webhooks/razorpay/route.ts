import { NextResponse } from 'next/server';
import { paymentService } from '@/services/payment.service';
import { createErrorResponse } from '@/lib/errors/error-handler';

export async function POST(req: Request) {
  try {
    const signature = req.headers.get('x-razorpay-signature');
    if (!signature) {
      return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
    }

    const bodyText = await req.text();
    
    await paymentService.handleWebhook(bodyText, signature);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    const errorResponse = createErrorResponse(error);
    return NextResponse.json(errorResponse.body, { status: errorResponse.status });
  }
}
