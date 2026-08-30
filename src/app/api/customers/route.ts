import { apiSuccess, withErrorHandler } from '@/middleware/api-middleware';
import { requireAuth } from '@/lib/auth/guard';
import { organizerRepository } from '@/repositories/organizer.repository';
import { customerRepository } from '@/repositories/customer.repository';
import { NextResponse } from 'next/server';

export const GET = withErrorHandler(async (request) => {
  const auth = await requireAuth();
  const organizer = await organizerRepository.findOne({ ownerId: auth.userId as any });
  
  if (!organizer) {
    return NextResponse.json({ error: { code: 'NOT_FOUND', message: 'Organizer not found' } }, { status: 404 });
  }

  const customers = await customerRepository.findMany(organizer._id as any, {});
  return apiSuccess(customers);
});