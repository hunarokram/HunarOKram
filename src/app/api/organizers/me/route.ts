import { requireAuth } from '@/lib/auth/guard';
import { parseBody, apiSuccess, withErrorHandler } from '@/middleware/api-middleware';
import { updateOrganizerSchema } from '@/schemas/organizer.schema';
import { organizerService } from '@/services/organizer.service';

export const GET = withErrorHandler(async () => {
  const auth = await requireAuth();
  
  const organizer = await organizerService.getCurrentOrganizer(auth.userId);
  
  return apiSuccess(organizer);
});

export const PATCH = withErrorHandler(async (request) => {
  const auth = await requireAuth();
  const data = await parseBody(request, updateOrganizerSchema);
  
  const organizer = await organizerService.getCurrentOrganizer(auth.userId);

  const updateData: any = { ...data };
  
  if (data.customDomain) {
    if (organizer.customDomain?.hostname !== data.customDomain) {
      // Import and call Cloudflare
      const { addCustomHostname } = await import('@/lib/cloudflare/custom-hostnames');
      await addCustomHostname(data.customDomain);
      
      updateData.customDomain = {
        hostname: data.customDomain,
        verified: false
      };
    } else {
      delete updateData.customDomain;
    }
  }

  const updated = await organizerService.updateOrganizer(organizer._id.toString(), updateData);
  
  return apiSuccess(updated);
});
