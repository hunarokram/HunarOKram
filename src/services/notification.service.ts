import { sendEmail } from '@/lib/email';

export const notificationService = {
  async sendBookingConfirmation(
    booking: any,
    experience: any,
    schedule: any,
    customer: any
  ) {
    const amount = (booking.amount / 100).toFixed(2);
    const date = new Date(schedule.startAt).toLocaleString();
    let quantity = booking.quantity;
    if (!quantity || quantity < 1) {
      if (booking.amount > 0 && experience.price > 0) {
        quantity = Math.round(booking.amount / experience.price);
      } else {
        quantity = 1;
      }
    }
    
    const html = `
      <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #fdfbf9; padding: 40px 20px;">
        <div style="background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.05); border: 1px solid #f0ebe1;">
          
          <!-- Ticket Header -->
          <div style="background: #d45f2a; padding: 30px; text-align: center; color: white;">
            <h1 style="margin: 0; font-size: 24px; font-weight: 600; letter-spacing: -0.5px;">Your E-Ticket</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">${experience.title}</p>
          </div>

          <!-- Ticket Body -->
          <div style="padding: 30px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <p style="margin: 0; color: #6b6b6b; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Admit</p>
              <h2 style="margin: 5px 0 0 0; font-size: 22px; color: #1a1a1a;">${customer.name}</h2>
              <p style="margin: 5px 0 0 0; color: #d45f2a; font-weight: bold;">${quantity} ${quantity === 1 ? 'Person' : 'People'}</p>
            </div>

            <div style="display: table; width: 100%; border-top: 1px dashed #e2e8f0; border-bottom: 1px dashed #e2e8f0; padding: 20px 0;">
              <div style="display: table-cell; width: 50%; padding-right: 15px;">
                <p style="margin: 0 0 5px 0; color: #6b6b6b; font-size: 13px; text-transform: uppercase;">Date & Time</p>
                <p style="margin: 0; font-weight: 600; color: #1a1a1a;">${date}</p>
              </div>
              <div style="display: table-cell; width: 50%; padding-left: 15px; border-left: 1px solid #f1f5f9;">
                <p style="margin: 0 0 5px 0; color: #6b6b6b; font-size: 13px; text-transform: uppercase;">Booking ID</p>
                <p style="margin: 0; font-weight: 600; color: #1a1a1a; word-break: break-all;">${booking.bookingNumber}</p>
              </div>
            </div>

            ${experience.location?.address ? `
            <div style="padding: 20px 0; border-bottom: 1px dashed #e2e8f0;">
              <p style="margin: 0 0 5px 0; color: #6b6b6b; font-size: 13px; text-transform: uppercase;">Venue Location</p>
              <p style="margin: 0 0 10px 0; font-weight: 500; color: #1a1a1a;">${experience.location.address}</p>
              ${experience.location.mapUrl ? `
                <a href="${experience.location.mapUrl}" target="_blank" style="display: inline-block; padding: 8px 16px; background-color: #f1f5f9; color: #0f172a; text-decoration: none; border-radius: 6px; font-size: 14px; font-weight: 500;">Get Directions</a>
              ` : ''}
            </div>
            ` : ''}

            <div style="margin-top: 30px; text-align: center;">
              <p style="margin: 0 0 15px 0; color: #6b6b6b; font-size: 14px;">Show this QR code at the venue</p>
              <img src="https://quickchart.io/qr?text=${encodeURIComponent(booking.bookingNumber)}&size=180&margin=2" alt="Ticket QR Code" width="180" height="180" style="border-radius: 8px; border: 1px solid #f1f5f9; padding: 10px;" />
            </div>
          </div>
          
          <!-- Ticket Footer -->
          <div style="background: #f8fafc; padding: 20px; text-align: center; border-top: 1px solid #f1f5f9;">
            <p style="margin: 0; color: #6b6b6b; font-size: 13px;">Amount Paid: ₹${amount}</p>
            <p style="margin: 10px 0 0 0; color: #94a3b8; font-size: 12px;">Please arrive 15 minutes before the start time.</p>
          </div>
        </div>
      </div>
    `;

    await sendEmail({
      to: customer.email,
      subject: `Booking Confirmed: ${experience.title}`,
      html,
    });
  },


  async sendOrganizerAlert(
    booking: any,
    experience: any,
    schedule: any,
    organizer: any,
    customer: any
  ) {
    const amount = (booking.amount / 100).toFixed(2);
    const date = new Date(schedule.startAt).toLocaleString();
    
    let quantity = booking.quantity;
    if (!quantity || quantity < 1) {
      if (booking.amount > 0 && experience.price > 0) {
        quantity = Math.round(booking.amount / experience.price);
      } else {
        quantity = 1;
      }
    }
    
    const html = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>New Booking Received!</h2>
        <p>You have a new booking for <strong>${experience.title}</strong></p>
        <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Customer:</strong> ${customer.name} (${customer.email})</p>
          <p><strong>Booking Reference:</strong> ${booking.bookingNumber}</p>
          <p><strong>Date & Time:</strong> ${date}</p>
          <p><strong>Amount Paid:</strong> ₹${amount}</p>
          <p><strong>Tickets:</strong> ${quantity}</p>
        </div>
        <a href="https://yourdomain.com/dashboard/bookings" style="display: inline-block; background: #000; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px;">View in Dashboard</a>
      </div>
    `;

    await sendEmail({
      to: organizer.contact.email,
      subject: `New Booking: ${experience.title}`,
      html,
    });
  },

  async sendFeedbackRequest(
    booking: any,
    experience: any,
    customer: any,
    organizerSlug: string,
    appUrl: string = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  ) {
    const reviewLink = `${appUrl}/${organizerSlug}/${experience._id.toString()}/review?bookingNumber=${booking.bookingNumber}`;
    
    const html = `
      <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #fdfbf9; padding: 40px 20px; text-align: center;">
        <div style="background: #ffffff; border-radius: 16px; padding: 40px; box-shadow: 0 10px 25px rgba(0,0,0,0.05); border: 1px solid #f0ebe1;">
          <h2 style="margin: 0 0 10px 0; color: #1a1a1a; font-size: 24px;">How was your experience?</h2>
          <p style="color: #6b6b6b; font-size: 16px; margin-bottom: 30px;">
            Hi ${customer.name}, we hope you enjoyed <strong>${experience.title}</strong>! We'd love to hear your thoughts.
          </p>
          
          <a href="${reviewLink}" style="display: inline-block; background: #d45f2a; color: #ffffff; font-weight: bold; font-size: 16px; padding: 15px 30px; text-decoration: none; border-radius: 8px;">
            Leave a Review
          </a>
          
          <p style="color: #94a3b8; font-size: 13px; margin-top: 30px;">
            It only takes a minute and helps other creators discover great experiences.
          </p>
        </div>
      </div>
    `;

    await sendEmail({
      to: customer.email,
      subject: `How was ${experience.title}?`,
      html,
    });
  },

  async sendRescheduleAlert(
    booking: any,
    experience: any,
    oldSchedule: any,
    newSchedule: any,
    customer: any
  ) {
    const oldDate = new Date(oldSchedule.startAt).toLocaleString();
    const newDate = new Date(newSchedule.startAt).toLocaleString();
    
    const html = `
      <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #fdfbf9; padding: 40px 20px;">
        <div style="background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.05); border: 1px solid #f0ebe1; text-align: center; padding: 40px;">
          
          <h1 style="color: #d45f2a; margin: 0 0 15px 0; font-size: 24px;">Event Rescheduled</h1>
          <p style="color: #475569; font-size: 16px; line-height: 1.5; margin: 0 0 30px 0;">
            Hi ${customer.name}, the date/time for <strong>${experience.title}</strong> has been changed by the organizer.
          </p>
          
          <div style="background: #fff7ed; padding: 20px; border-radius: 8px; margin-bottom: 20px; text-align: left; border: 1px solid #ffedd5;">
            <p style="margin: 0 0 10px 0; color: #9a3412;"><strong>Old Date:</strong> <span style="text-decoration: line-through;">${oldDate}</span></p>
            <p style="margin: 0; color: #166534; font-size: 18px;"><strong>New Date:</strong> ${newDate}</p>
          </div>
          
          <p style="color: #64748b; font-size: 14px;">
            Your existing ticket remains valid for the new date. If you cannot make it, please contact the organizer.
          </p>
        </div>
      </div>
    `;

    await sendEmail({
      to: customer.email,
      subject: `Update: ${experience.title} has been rescheduled`,
      html,
    });
  },

  async sendCancellationAlert(
    booking: any,
    experience: any,
    schedule: any,
    customer: { name: string; email: string }
  ) {
    const eventDate = new Intl.DateTimeFormat('en-IN', {
      weekday: 'long', month: 'long', day: 'numeric',
      hour: 'numeric', minute: '2-digit', hour12: true
    }).format(new Date(schedule.startAt));

    const html = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background-color: #fef2f2; padding: 30px; border-radius: 16px; text-align: center; border: 1px solid #fecaca;">
          <h1 style="color: #991b1b; margin: 0 0 10px 0; font-size: 24px;">Event Cancelled</h1>
          <p style="color: #7f1d1d; font-size: 16px; margin: 0;"><strong>${experience.title}</strong></p>
        </div>
        
        <div style="padding: 20px 10px;">
          <p style="color: #334155; font-size: 16px;">Hi ${customer.name},</p>
          <p style="color: #334155; font-size: 16px; line-height: 1.5;">
            We are writing to inform you that the upcoming session for <strong>${experience.title}</strong> on <strong>${eventDate}</strong> has been cancelled by the organizer.
          </p>
          
          <div style="background: #fff; padding: 20px; border-radius: 8px; margin-top: 20px; border: 1px solid #e2e8f0;">
            <h3 style="margin-top: 0; color: #0f172a;">Refund Information</h3>
            <p style="color: #475569; margin-bottom: 0;">
              Your refund will be processed directly by the organizer within 5-7 business days. If you paid online, the amount will be refunded to your original payment method. If you paid manually, the organizer will contact you.
            </p>
          </div>
          
          <p style="color: #64748b; font-size: 14px; margin-top: 30px;">
            We apologize for any inconvenience caused.
          </p>
        </div>
      </div>
    `;

    await sendEmail({
      to: customer.email,
      subject: `Cancelled: ${experience.title}`,
      html,
    });
  },

  async sendBookingRejection(
    booking: any,
    experience: any,
    schedule: any,
    customer: any
  ) {
    const html = `
      <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #fdfbf9; padding: 40px 20px;">
        <div style="background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.05); border: 1px solid #f0ebe1; text-align: center; padding: 40px;">
          
          <h1 style="color: #ef4444; margin: 0 0 15px 0; font-size: 24px;">Booking Not Approved</h1>
          <p style="color: #475569; font-size: 16px; line-height: 1.5; margin: 0 0 30px 0;">
            Hi ${customer.name}, unfortunately the organizer could not approve your booking for <strong>${experience.title}</strong>.
          </p>
          
          <p style="color: #64748b; font-size: 14px;">
            If you have made a payment manually, please reach out to the organizer for a refund. We apologize for any inconvenience.
          </p>
        </div>
      </div>
    `;

    await sendEmail({
      to: customer.email,
      subject: `Update on your booking for ${experience.title}`,
      html,
    });
  }
};

