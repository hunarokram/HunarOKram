'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';

import { ImageUploader } from '@/components/ui/image-uploader';

export default function BookingForm({ 
  organizerId, 
  experienceId, 
  schedules, 
  price,
  offers = [],
  razorpayEnabled = true,
  manualPaymentEnabled = false,
  manualPaymentUpiId = '',
  manualPaymentQrCodeUrl = '',
  manualPaymentLink = ''
}: { 
  organizerId: string;
  experienceId: string;
  schedules: any[];
  price: number;
  offers?: { minQuantity: number; discountPercentage: number }[];
  razorpayEnabled?: boolean;
  manualPaymentEnabled?: boolean;
  manualPaymentUpiId?: string;
  manualPaymentQrCodeUrl?: string;
  manualPaymentLink?: string;
}) {
  const router = useRouter();
  const params = useParams();
  const organizerSlug = params?.organizerSlug as string;
  const [selectedScheduleId, setSelectedScheduleId] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'razorpay' | 'manual'>(
    razorpayEnabled ? 'razorpay' : manualPaymentEnabled ? 'manual' : 'razorpay'
  );
  const [paymentScreenshotUrl, setPaymentScreenshotUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const selectedSchedule = schedules.find(s => s._id === selectedScheduleId);
  const maxSpots = selectedSchedule ? selectedSchedule.capacity - selectedSchedule.bookedCount : 10;
  
  const handleQuantityChange = (delta: number) => {
    setQuantity(prev => {
      const newQ = prev + delta;
      if (newQ < 1) return 1;
      if (newQ > maxSpots) return maxSpots;
      return newQ;
    });
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!selectedScheduleId) {
      setError('Please select a schedule');
      setIsLoading(false);
      return;
    }
    
    if (quantity > maxSpots) {
      setError(`Only ${maxSpots} spots available`);
      setIsLoading(false);
      return;
    }

    if (price > 0 && paymentMethod === 'manual' && !paymentScreenshotUrl) {
      setError('Please upload a screenshot of your payment');
      setIsLoading(false);
      return;
    }

    try {
      // 1. Create Booking
      const bookingRes = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          organizerId,
          experienceId,
          scheduleId: selectedScheduleId,
          quantity,
          paymentMethod: price > 0 ? paymentMethod : 'razorpay',
          paymentScreenshotUrl,
          idempotencyKey: crypto.randomUUID(),
          customerDetails: {
            name,
            email,
            phone
          }
        }),
      });

      if (!bookingRes.ok) {
        const errData = await bookingRes.json();
        const msg = errData.error?.message || 'Failed to create booking';
        throw new Error(msg);
      }

      const booking = await bookingRes.json();
      
      // If free experience or manual payment, go straight to success
      if (price === 0 || paymentMethod === 'manual') {
        router.push(`/${organizerSlug}/booking-success`);
        return;
      }

      // 2. Load Razorpay
      const isLoaded = await loadRazorpayScript();
      if (!isLoaded) {
        throw new Error('Razorpay SDK failed to load');
      }

      // 3. Initiate Payment
      const paymentRes = await fetch('/api/payments/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingNumber: booking.data.bookingNumber }),
      });

      if (!paymentRes.ok) {
        const pErr = await paymentRes.json();
        throw new Error(pErr.error || 'Failed to initialize payment');
      }

      const order = await paymentRes.json();

      // 4. Open Razorpay Checkout
      const options = {
        key: order.keyId,
        amount: order.amount, // backend already calculated total (price * quantity)
        currency: order.currency,
        name: 'Workshop Booking',
        description: `Payment for ${quantity} ticket(s)`,
        order_id: order.orderId,
        handler: async function (response: any) {
          try {
            const verifyRes = await fetch('/api/payments/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
                bookingNumber: booking.data.bookingNumber
              })
            });
            if (!verifyRes.ok) throw new Error('Payment verification failed');
            router.push(`/${organizerSlug}/booking-success`);
          } catch (e: any) {
            setError(e.message || 'Payment verification failed');
          }
        },
        prefill: {
          name: name,
          email: email,
          contact: phone,
        },
        theme: {
          color: 'var(--text-main)',
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on('payment.failed', function (response: any) {
        setError(response.error.description);
      });
      rzp.open();
    } catch (err: any) {
      setError(err.message || 'An error occurred during checkout');
    } finally {
      setIsLoading(false);
    }
  };

  const fmt = (date: string, opts: Intl.DateTimeFormatOptions) =>
    new Intl.DateTimeFormat('en-IN', opts).format(new Date(date));
    
  let discountPercentage = 0;
  if (offers && offers.length > 0) {
    for (const offer of offers) {
      if (quantity >= offer.minQuantity && offer.discountPercentage > discountPercentage) {
        discountPercentage = offer.discountPercentage;
      }
    }
  }

  const basePrice = price * quantity;
  const totalPrice = Math.round(basePrice * (1 - discountPercentage / 100));

  return (
    <form onSubmit={handleBooking} className="flex flex-col divide-y divide-[var(--border)]">

      {/* Date selection */}
      <div className="p-6 space-y-3">
        <p className="text-xs font-semibold tracking-widest uppercase text-[var(--text-light)]">Select Date</p>
        {schedules.length === 0 ? (
          <div className="py-6 text-center text-sm text-[var(--text-light)] italic">No upcoming dates available.</div>
        ) : (
          <div className="space-y-2">
            {schedules.map((schedule) => {
              const spotsLeft = schedule.capacity - schedule.bookedCount;
              const isSelected = selectedScheduleId === schedule._id;
              const isMultiSession = schedule.sessions && schedule.sessions.length > 1;
              return (
                <label
                  key={schedule._id}
                  className={`flex items-start justify-between p-3.5 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'border-[var(--text-main)] bg-[var(--bg-alt)] shadow-sm'
                      : 'border-[var(--border)] hover:border-[var(--accent)] hover:bg-[var(--bg-main)]'
                  }`}
                  onClick={() => {
                     // Ensure quantity doesn't exceed newly selected schedule's capacity
                     if (quantity > spotsLeft) setQuantity(Math.max(1, spotsLeft));
                  }}
                >
                  <div className="flex items-start gap-3">
                    <input type="radio" name="schedule" value={schedule._id}
                      checked={isSelected} onChange={(e) => setSelectedScheduleId(e.target.value)}
                      className="sr-only" />
                    <div className={`mt-0.5 w-4 h-4 rounded-full border-2 flex-shrink-0 transition-all ${
                      isSelected ? 'border-[var(--text-main)] bg-[var(--text-main)]' : 'border-[var(--border)]'
                    }`}>
                      {isSelected && <div className="w-1.5 h-1.5 bg-white rounded-full mx-auto mt-0.5" />}
                    </div>
                    <div>
                      {!isMultiSession ? (
                        <>
                          <p className="text-sm font-semibold text-[var(--text-main)]">
                            {fmt(schedule.startAt, { weekday: 'short', month: 'short', day: 'numeric' })}
                          </p>
                          <p className="text-xs text-[var(--text-light)] mt-0.5">
                            {fmt(schedule.startAt, { hour: 'numeric', minute: '2-digit', hour12: true })} • {fmt(schedule.endAt, { hour: 'numeric', minute: '2-digit', hour12: true })}
                          </p>
                        </>
                      ) : (
                        <>
                          <p className="text-sm font-semibold text-[var(--text-main)]">{schedule.sessions.length}-Day Cohort</p>
                          <p className="text-xs text-[var(--text-light)] mt-0.5">
                            {fmt(schedule.startAt, { month: 'short', day: 'numeric' })} • {fmt(schedule.endAt, { month: 'short', day: 'numeric' })}
                          </p>
                          {isSelected && (
                            <div className="mt-2 space-y-0.5 border-t border-[var(--border)] pt-2">
                              {schedule.sessions.map((sess: any, i: number) => (
                                <p key={i} className="text-xs text-[var(--text-light)]">
                                  · {fmt(sess.startAt, { weekday: 'short', month: 'short', day: 'numeric' })}, {fmt(sess.startAt, { hour: 'numeric', minute: '2-digit', hour12: true })} • {fmt(sess.endAt, { hour: 'numeric', minute: '2-digit', hour12: true })}
                                </p>
                              ))}
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                  <span className={`text-xs font-medium mt-0.5 whitespace-nowrap ${
                    spotsLeft <= 3 ? 'text-red-600' : 'text-[var(--text-light)]'
                  }`}>
                    {spotsLeft} left
                  </span>
                </label>
              );
            })}
          </div>
        )}
      </div>

      {/* Tickets / Quantity */}
      <div className="p-6 space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold tracking-widest uppercase text-[var(--text-light)]">Tickets</p>
          {selectedSchedule && <p className="text-xs text-[var(--text-light)]">{maxSpots} spots available</p>}
        </div>
        
        {offers && offers.length > 0 && (
          <div className="bg-[#f0fdf4] border border-[#bbf7d0] p-3 rounded-lg flex flex-col gap-1 mb-2">
            <p className="text-sm font-semibold text-[#166534]">🎁 Bulk Discounts Available!</p>
            <ul className="text-xs text-[#15803d] space-y-0.5">
              {offers.map((o, i) => (
                <li key={i}>• Book {o.minQuantity}+ tickets and get {o.discountPercentage}% off!</li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex items-center justify-between p-4 rounded-xl border border-[var(--border)] bg-[var(--bg-main)]">
          <div>
            <p className="text-sm font-semibold text-[var(--text-main)]">Quantity</p>
            <p className="text-xs text-[var(--text-light)] mt-0.5">
              {price > 0 ? `₹${(price/100).toLocaleString('en-IN')} per ticket` : 'Free entry'}
              {discountPercentage > 0 && (
                <span className="ml-2 text-[#166534] font-medium">({discountPercentage}% applied!)</span>
              )}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              type="button" 
              onClick={() => handleQuantityChange(-1)}
              disabled={quantity <= 1}
              className="w-8 h-8 flex items-center justify-center rounded-full border border-[var(--border)] text-[var(--text-main)] hover:bg-[var(--bg-alt)] disabled:opacity-30 transition-all"
            >-</button>
            <span className="w-4 text-center text-sm font-semibold text-[var(--text-main)]">{quantity}</span>
            <button 
              type="button" 
              onClick={() => handleQuantityChange(1)}
              disabled={quantity >= maxSpots || !selectedScheduleId}
              className="w-8 h-8 flex items-center justify-center rounded-full border border-[var(--border)] text-[var(--text-main)] hover:bg-[var(--bg-alt)] disabled:opacity-30 transition-all"
            >+</button>
          </div>
        </div>
      </div>

      {/* Your details */}
      <div className="p-6 space-y-4">
        <p className="text-xs font-semibold tracking-widest uppercase text-[var(--text-light)]">Your Details</p>
        <input type="text" required value={name} onChange={(e) => setName(e.target.value)}
          placeholder="Full Name"
          className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-main)] px-4 py-3 text-sm text-[var(--text-main)] placeholder:text-[var(--text-light)] focus:outline-none focus:border-[var(--text-main)] focus:ring-2 focus:ring-[var(--text-main)] focus:ring-opacity-10 transition-all" />
        <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
          placeholder="Email Address"
          className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-main)] px-4 py-3 text-sm text-[var(--text-main)] placeholder:text-[var(--text-light)] focus:outline-none focus:border-[var(--text-main)] focus:ring-2 focus:ring-[var(--text-main)] focus:ring-opacity-10 transition-all" />
        <input type="tel" required value={phone} onChange={(e) => setPhone(e.target.value)}
          placeholder="Phone Number"
          className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-main)] px-4 py-3 text-sm text-[var(--text-main)] placeholder:text-[var(--text-light)] focus:outline-none focus:border-[var(--text-main)] focus:ring-2 focus:ring-[var(--text-main)] focus:ring-opacity-10 transition-all" />
      </div>

      {/* Payment Details */}
      {price > 0 && (razorpayEnabled || manualPaymentEnabled) && (
        <div className="p-6 pt-0 space-y-4 border-t border-[var(--border)] mt-2">
          <p className="text-xs font-semibold tracking-widest uppercase text-[var(--text-light)] pt-6">Payment</p>
          
          {razorpayEnabled && manualPaymentEnabled && (
            <div className="grid grid-cols-2 gap-3 mb-4">
              <label className={`cursor-pointer rounded-xl border p-3 flex flex-col items-center justify-center gap-2 transition-all ${paymentMethod === 'razorpay' ? 'border-[var(--text-main)] bg-[var(--bg-alt)] shadow-sm' : 'border-[var(--border)] hover:border-warm-300'}`}>
                <input type="radio" name="paymentMethod" value="razorpay" className="sr-only" 
                  checked={paymentMethod === 'razorpay'} onChange={() => setPaymentMethod('razorpay')} />
                <span className="text-sm font-semibold text-[var(--text-main)]">Pay Online</span>
                <span className="text-xs text-[var(--text-light)] text-center">Card, UPI, Netbanking</span>
              </label>
              <label className={`cursor-pointer rounded-xl border p-3 flex flex-col items-center justify-center gap-2 transition-all ${paymentMethod === 'manual' ? 'border-[var(--text-main)] bg-[var(--bg-alt)] shadow-sm' : 'border-[var(--border)] hover:border-warm-300'}`}>
                <input type="radio" name="paymentMethod" value="manual" className="sr-only" 
                  checked={paymentMethod === 'manual'} onChange={() => setPaymentMethod('manual')} />
                <span className="text-sm font-semibold text-[var(--text-main)]">Pay via QR</span>
                <span className="text-xs text-[var(--text-light)] text-center">Manual Verification</span>
              </label>
            </div>
          )}

          {paymentMethod === 'manual' && (
            <div className="bg-[var(--bg-alt)] p-4 rounded-xl border border-[var(--border)] space-y-4">
              <div className="text-center">
                <p className="text-sm font-semibold text-[var(--text-main)]">Pay ₹{(totalPrice / 100).toLocaleString('en-IN')}</p>
                <p className="text-xs text-[var(--text-light)] mb-3">Scan this QR to pay directly to the organizer</p>
                {manualPaymentQrCodeUrl && (
                  <div className="relative w-48 h-48 mx-auto rounded-lg overflow-hidden border border-[var(--border)] bg-white p-2">
                    <img src={manualPaymentQrCodeUrl} alt="UPI QR Code" className="w-full h-full object-contain" />
                  </div>
                )}
                {manualPaymentLink && (
                  <div className="mt-4">
                    <a 
                      href={manualPaymentLink}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-[var(--text-main)] text-[var(--bg-main)] text-sm font-semibold rounded-xl hover:opacity-90 transition-opacity"
                    >
                      Pay ₹{(totalPrice / 100).toLocaleString('en-IN')} via Payment Link
                    </a>
                  </div>
                )}
                {manualPaymentUpiId && !manualPaymentLink && (
                  <p className="text-xs text-[var(--text-main)] font-medium mt-3 bg-[var(--bg-main)] py-1.5 px-3 rounded-full inline-block border border-[var(--border)]">
                    UPI ID: {manualPaymentUpiId}
                  </p>
                )}
              </div>
              
              <div className="pt-3 border-t border-[var(--border)]">
                <p className="text-sm font-semibold text-[var(--text-main)] mb-1">Upload Payment Screenshot</p>
                <p className="text-xs text-[var(--text-light)] mb-3">We need to manually verify your payment.</p>
                <ImageUploader 
                  images={paymentScreenshotUrl ? [paymentScreenshotUrl] : []} 
                  onChange={(imgs) => setPaymentScreenshotUrl(imgs[0] || '')} 
                  maxImages={1} 
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* CTA */}
      <div className="p-6 space-y-3">
        {error && (
          <div className="text-red-700 bg-red-50 border border-red-100 rounded-xl px-4 py-3 text-xs">{error}</div>
        )}
        <button
          type="submit"
          disabled={isLoading || !selectedScheduleId || schedules.length === 0}
          className="w-full bg-[var(--text-main)] text-white py-4 px-6 rounded-xl font-semibold text-sm tracking-wide hover:bg-[var(--bg-dark)] active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:scale-100"
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
              Processing...
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              {`Reserve ${quantity} Spot${quantity > 1 ? 's' : ''}`}
              {totalPrice > 0 ? (
                <>
                  <span> • </span>
                  {discountPercentage > 0 && (
                    <span className="line-through opacity-60 font-normal mr-1">
                      ₹{(basePrice / 100).toLocaleString('en-IN')}
                    </span>
                  )}
                  <span>₹{(totalPrice / 100).toLocaleString('en-IN')}</span>
                </>
              ) : ' • Free'}
            </span>
          )}
        </button>
        <p className="text-center text-xs text-[var(--text-light)]">No charges until you confirm payment</p>
      </div>
    </form>
  );
}
