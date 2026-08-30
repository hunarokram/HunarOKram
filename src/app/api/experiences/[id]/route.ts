import { requireAuth } from '@/lib/auth/guard';
import { parseBody, apiSuccess, withErrorHandler } from '@/middleware/api-middleware';
import { updateExperienceSchema } from '@/schemas/experience.schema';
import { experienceService } from '@/services/experience.service';
import { organizerRepository } from '@/repositories/index';
import { ForbiddenError } from '@/lib/errors/errors';

async function getOrganizerId(userId: string) {
  const organizer = await organizerRepository.findOne({ ownerId: userId });
  if (!organizer) {
    throw new ForbiddenError('You must complete organizer onboarding first');
  }
  return organizer._id.toString();
}

export const GET = withErrorHandler(async (request, context) => {
  const auth = await requireAuth();
  const organizerId = await getOrganizerId(auth.userId);
  
  const params = await context.params;
  const id = params.id as string;
  
  const experience = await experienceService.getExperienceById(organizerId, id);
  
  return apiSuccess(experience);
});

export const PATCH = withErrorHandler(async (request, context) => {
  const auth = await requireAuth();
  const organizerId = await getOrganizerId(auth.userId);
  
  const params = await context.params;
  const id = params.id as string;
  
  const data = await parseBody(request, updateExperienceSchema);
  
  const updatedExperience = await experienceService.updateExperience(organizerId, id, data);
  
  return apiSuccess(updatedExperience);
});

export const DELETE = withErrorHandler(async (request, context) => {
  const auth = await requireAuth();
  const organizerId = await getOrganizerId(auth.userId);
  
  const params = await context.params;
  const id = params.id as string;
  
  await experienceService.deleteExperience(organizerId, id);
  
  return apiSuccess({ message: 'Experience deleted successfully' });
});
