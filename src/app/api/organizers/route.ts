import { requireAuth } from '@/lib/auth/guard';
import { parseBody, apiSuccess, withErrorHandler } from '@/middleware/api-middleware';
import { createOrganizerSchema } from '@/schemas/organizer.schema';
import { organizerService } from '@/services/organizer.service';
import { userRepository } from '@/repositories';

export const POST = withErrorHandler(async (request) => {
  const auth = await requireAuth();
  const data = await parseBody(request, createOrganizerSchema);
  
  const user = await userRepository.findById(auth.userId);
  if (!user) throw new Error("User not found");

  const organizerData = {
    ...data,
    contact: data.contact?.email ? data.contact : { email: user.email }
  };
  
  const organizer = await organizerService.createOrganizer(auth.userId, organizerData as any);
  
  return apiSuccess(organizer, 201);
});
