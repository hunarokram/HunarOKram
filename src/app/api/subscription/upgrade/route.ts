import { requireAuth } from '@/lib/auth/guard';
import { apiSuccess, withErrorHandler } from '@/middleware/api-middleware';
import { organizerRepository } from '@/repositories/index';
import { ForbiddenError } from '@/lib/errors/errors';

export const POST = withErrorHandler(async (request) => {
  const auth = await requireAuth();
  
  const organizer = await organizerRepository.findOne({ ownerId: auth.userId });
  if (!organizer) {
    throw new ForbiddenError('You must complete organizer onboarding first');
  }

  let screenshotUrl, transactionId, name, phone;
  try {
    const body = await request.json();
    screenshotUrl = body.screenshotUrl;
    transactionId = body.transactionId;
    name = body.name;
    phone = body.phone;
  } catch (e) {
    // ignore
  }

  if (!screenshotUrl || !transactionId || !name || !phone) {
    throw new Error('All payment details (screenshot, transaction ID, name, phone) are required for manual subscription upgrade');
  }
  
  // Set the subscription to pending verification and save the receipt
  const updatedOrganizer = await organizerRepository.update(organizer._id, {
    $set: { 
      subscriptionStatus: 'pending_verification',
      subscriptionPaymentScreenshotUrl: screenshotUrl,
      subscriptionPaymentDetails: {
        transactionId,
        name,
        phone
      }
    }
  });

  return apiSuccess(updatedOrganizer, 200);
});
