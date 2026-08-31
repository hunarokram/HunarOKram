import { NextResponse } from 'next/server';
import { SystemSettings } from '@/models/system-settings.model';
import { apiSuccess, withErrorHandler } from '@/middleware/api-middleware';

export const GET = withErrorHandler(async () => {
  let settings = await SystemSettings.findOne();
  if (!settings) {
    settings = await SystemSettings.create({});
  }
  
  return apiSuccess({
    adminUpiId: settings.adminUpiId,
    adminUpiName: settings.adminUpiName,
    subscriptionPrice: settings.subscriptionPrice,
  });
});
