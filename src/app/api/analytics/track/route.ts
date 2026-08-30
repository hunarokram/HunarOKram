import { NextRequest, NextResponse } from 'next/server';
import { AnalyticsDaily } from '@/models/analytics.model';
import { organizerRepository } from '@/repositories';
import { connectToDatabase } from '@/lib/db/connection';

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const { slug } = await req.json();
    if (!slug) return NextResponse.json({ error: 'Slug is required' }, { status: 400 });

    const organizer = await organizerRepository.findBySlug(slug);
    if (!organizer) return NextResponse.json({ error: 'Organizer not found' }, { status: 404 });

    const today = new Date().toISOString().split('T')[0];

    await AnalyticsDaily.updateOne(
      { organizerId: organizer._id, date: today } as any,
      { $inc: { views: 1 } },
      { upsert: true }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to track view:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
