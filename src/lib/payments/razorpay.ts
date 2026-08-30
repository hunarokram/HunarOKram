import crypto from 'node:crypto';

export class RazorpayClient {
  private keyId: string;
  private keySecret: string;
  private baseUrl = 'https://api.razorpay.com/v1';

  constructor(keyId?: string, keySecret?: string) {
    this.keyId = keyId || process.env.RAZORPAY_KEY_ID || '';
    this.keySecret = keySecret || process.env.RAZORPAY_KEY_SECRET || '';
  }

  async createOrder(amount: number, receipt: string) {
    const auth = Buffer.from(`${this.keyId}:${this.keySecret}`).toString('base64');
    const response = await fetch(`${this.baseUrl}/orders`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount, // in paise
        currency: 'INR',
        receipt,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Razorpay createOrder failed: ${errorText}`);
    }

    const data = await response.json();
    return data;
  }

  verifySignature(orderId: string, paymentId: string, signature: string, secret: string): boolean {
    const generatedSignature = crypto
      .createHmac('sha256', secret)
      .update(`${orderId}|${paymentId}`)
      .digest('hex');
    
    return generatedSignature === signature;
  }

  verifyWebhookSignature(body: string, signature: string, secret: string): boolean {
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(body)
      .digest('hex');
    
    return expectedSignature === signature;
  }
}

export const razorpayClient = new RazorpayClient();
