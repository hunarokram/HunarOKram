import { NextResponse, NextRequest } from 'next/server';
import { SystemSettings } from '@/models/system-settings.model';
import { requireAuth } from '@/lib/auth/guard';
import { userRepository } from '@/repositories';
import { apiSuccess, apiError, withErrorHandler } from '@/middleware/api-middleware';

export const PUT = withErrorHandler(async (request: any) => {
  const auth = await requireAuth();
  const user = await userRepository.findById(auth.userId);
  
  if (!user || user.globalRole !== 'admin') {
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
    settings.adminQrCodeUrl = data.adminQrCodeUrl ?? settings.adminQrCodeUrl;
    await settings.save();
  }
  
  return apiSuccess({
    message: 'Settings updated successfully',
    settings: {
      adminUpiId: settings.adminUpiId,
      adminUpiName: settings.adminUpiName,
      subscriptionPrice: settings.subscriptionPrice,
      adminQrCodeUrl: settings.adminQrCodeUrl
    }
  });
});
