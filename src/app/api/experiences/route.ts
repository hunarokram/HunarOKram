import { requireAuth } from '@/lib/auth/guard';
import { parseBody, parseSearchParams, apiSuccess, withErrorHandler } from '@/middleware/api-middleware';
import { createExperienceSchema, experienceQuerySchema } from '@/schemas/experience.schema';
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

export const GET = withErrorHandler(async (request) => {
  const auth = await requireAuth();
  const organizerId = await getOrganizerId(auth.userId);
  
  const url = new URL(request.url);
  const query = parseSearchParams(url, experienceQuerySchema);
  
  const result = await experienceService.getExperiences(organizerId, query);
  
  return apiSuccess(result.data, 200, {
    total: result.total,
    page: result.page,
    pageSize: result.pageSize,
    totalPages: result.totalPages
  });
});

export const POST = withErrorHandler(async (request) => {
  const auth = await requireAuth();
  const organizerId = await getOrganizerId(auth.userId);
  
  const data = await parseBody(request, createExperienceSchema);
  
  const experience = await experienceService.createExperience(organizerId, data);
  
  return apiSuccess(experience, 201);
});
