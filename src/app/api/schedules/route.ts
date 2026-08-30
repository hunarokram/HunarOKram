import { requireAuth } from '@/lib/auth/guard';
import { parseBody, parseSearchParams, apiSuccess, withErrorHandler } from '@/middleware/api-middleware';
import { createScheduleSchema, scheduleQuerySchema } from '@/schemas/schedule.schema';
import { scheduleService } from '@/services/schedule.service';
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
  const query = parseSearchParams(url, scheduleQuerySchema);
  
  const result = await scheduleService.getSchedules(organizerId, query);
  
  return apiSuccess(result, 200);
});

export const POST = withErrorHandler(async (request) => {
  const auth = await requireAuth();
  const organizerId = await getOrganizerId(auth.userId);
  
  const data = await parseBody(request, createScheduleSchema);
  
  const schedule = await scheduleService.createSchedule(organizerId, data);
  
  return apiSuccess(schedule, 201);
});
