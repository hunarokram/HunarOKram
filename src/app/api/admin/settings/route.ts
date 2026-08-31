import { NextResponse, NextRequest } from 'next/server';
import { SystemSettings } from '@/models/system-settings.model';
import { requireAuth } from '@/lib/auth/guard';
import { userRepository } from '@/repositories';
import { apiSuccess, apiError, withErrorHandler } from '@/middleware/api-middleware';

export const PUT = withErrorHandler(async (request: NextRequest) => {
  const auth = await requireAuth();
  const user = await userRepository.findById(auth.userId);
  
  if (!user || user.role !== 'SUPER_ADMIN') {
    return apiError('UNAUTHORIZED', 'Super admin access required', 403);
  }

  const data = await request.json();
  
  let settings = await SystemSettings.findOne();
  if (!settings) {
    settings = await SystemSettings.create(data);
  } else {
    settings.adminUpiId = data.adminUpiId ?? settings.adminUpiId;
    settings.adminUpiName = data.adminUpiName ?? settings.adminUpiName;
    settings.subscriptionPrice = data.subscriptionPrice ?? settings.subscriptionPrice;
    await settings.save();
  }
  
  return apiSuccess({
    message: 'Settings updated successfully',
    settings: {
      adminUpiId: settings.adminUpiId,
      adminUpiName: settings.adminUpiName,
      subscriptionPrice: settings.subscriptionPrice
    }
  });
});
