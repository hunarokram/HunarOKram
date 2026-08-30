import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/connection';
import { scheduleRepository } from '@/repositories/schedule.repository';
import { bookingRepository } from '@/repositories/booking.repository';
import { experienceRepository } from '@/repositories/experience.repository';
import { organizerRepository } from '@/repositories/organizer.repository';
import { customerRepository } from '@/repositories/customer.repository';
import { notificationService } from '@/services/notification.service';
import mongoose from 'mongoose';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const key = searchParams.get('key');
    if (process.env.CRON_SECRET && key !== process.env.CRON_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();
    
    const now = new Date();
    const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    // Using raw model from repo for cross-tenant query since this cron job affects all organizers
    const pastSchedules = await (scheduleRepository as any).model.find({
      endAt: { $lt: now, $gt: twentyFourHoursAgo }
    }).lean();

    if (!pastSchedules.length) {
      return NextResponse.json({ success: true, message: 'No recently finished schedules found.' });
    }

    const scheduleIds = pastSchedules.map((s: any) => s._id);

    const bookings = await (bookingRepository as any).model.find({
      scheduleId: { $in: scheduleIds },
      status: 'confirmed',
      feedbackEmailSent: { $ne: true }
    }).lean();

    if (!bookings.length) {
      return NextResponse.json({ success: true, message: 'No pending feedback emails to send.' });
    }

    let sentCount = 0;

    for (const booking of bookings) {
      try {
        const experience = await experienceRepository.findById(booking.organizerId, booking.experienceId);
        const organizer = await organizerRepository.findOne({ _id: booking.organizerId });
        const customer = await customerRepository.findById(booking.organizerId, booking.customerId);

        if (experience && organizer && customer) {
          await notificationService.sendFeedbackRequest(booking, experience, customer, organizer.slug);
          
          await (bookingRepository as any).model.findByIdAndUpdate(booking._id, { feedbackEmailSent: true });
          sentCount++;
        }
      } catch (err) {
        console.error(`Failed to send feedback email for booking ${booking._id}:`, err);
      }
    }

    return NextResponse.json({ success: true, emailsSent: sentCount });

  } catch (error: any) {
    console.error('CRON Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
