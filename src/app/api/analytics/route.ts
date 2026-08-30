import { NextRequest, NextResponse } from 'next/server';
import { AnalyticsDaily } from '@/models/analytics.model';
import { bookingRepository, organizerRepository } from '@/repositories';
import { requireAuth } from '@/lib/auth/guard';
import { apiSuccess, withErrorHandler } from '@/middleware/api-middleware';
import mongoose from 'mongoose';

export const GET = withErrorHandler(async () => {
  const auth = await requireAuth();
  const organizer = await organizerRepository.findOne({ ownerId: auth.userId as any });
  
  if (!organizer) {
    throw new Error('Organizer not found');
  }

  // Aggregate past 30 days of views
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const thirtyDaysAgoStr = thirtyDaysAgo.toISOString().split('T')[0];

  const filter: any = {
    organizerId: organizer._id,
    date: { $gte: thirtyDaysAgoStr }
  };
  const dailyViews = await (AnalyticsDaily as any).find(filter).sort({ date: 1 });

  // Fill in missing dates with 0 views
  const chartData = [];
  let totalViews = 0;
  
  for (let i = 0; i <= 30; i++) {
    const d = new Date(thirtyDaysAgo);
    d.setDate(d.getDate() + i);
    const dateStr = d.toISOString().split('T')[0];
    const record = dailyViews.find(v => v.date === dateStr);
    const views = record ? record.views : 0;
    
    totalViews += views;
    
    chartData.push({
      date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      views
    });
  }

  // Get total bookings and revenue
  const bookings = await (bookingRepository as any).model.find({ 
    organizerId: organizer._id,
    status: 'confirmed'
  });

  const totalBookings = bookings.length;
  const totalRevenue = bookings.reduce((sum: number, b: any) => sum + (b.totalAmount || 0), 0);

  return apiSuccess({
    totalViews,
    totalBookings,
    totalRevenue,
    chartData
  });
});
